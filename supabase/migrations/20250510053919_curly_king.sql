/*
  # Initial Schema for BookTable Application

  1. New Tables
    - `users`
      - `id` (uuid, primary key) - Maps to Supabase Auth user ID
      - `email` (text) - User's email address
      - `first_name` (text) - User's first name
      - `last_name` (text) - User's last name
      - `role` (text) - User's role (customer, restaurantManager, admin)
      - `created_at` (timestamptz) - Account creation timestamp
      
    - `restaurants`
      - `id` (uuid, primary key)
      - `name` (text) - Restaurant name
      - `description` (text) - Restaurant description
      - `cuisine_type` (text) - Type of cuisine
      - `price_range` (text) - Price range (€, €€, €€€, €€€€)
      - `address` (jsonb) - Address details
      - `contact` (jsonb) - Contact information
      - `hours` (jsonb) - Business hours
      - `images` (text[]) - Array of image URLs
      - `rating` (numeric) - Average rating
      - `booked_today` (int) - Number of bookings today
      - `approved` (boolean) - Approval status
      - `manager_id` (uuid) - Reference to manager's user ID
      - `created_at` (timestamptz) - Creation timestamp
      
    - `tables`
      - `id` (uuid, primary key)
      - `restaurant_id` (uuid) - Reference to restaurant
      - `name` (text) - Table name/number
      - `size` (int) - Number of seats
      
    - `reviews`
      - `id` (uuid, primary key)
      - `restaurant_id` (uuid) - Reference to restaurant
      - `user_id` (uuid) - Reference to user
      - `rating` (int) - Rating (1-5)
      - `comment` (text) - Review text
      - `created_at` (timestamptz) - Review timestamp
      
    - `bookings`
      - `id` (uuid, primary key)
      - `restaurant_id` (uuid) - Reference to restaurant
      - `user_id` (uuid) - Reference to user
      - `table_id` (uuid) - Reference to table
      - `date` (date) - Booking date
      - `time` (time) - Booking time
      - `party_size` (int) - Number of people
      - `status` (text) - Booking status
      - `created_at` (timestamptz) - Booking timestamp

  2. Security
    - Enable RLS on all tables
    - Add policies for:
      - Users can read their own data
      - Restaurant managers can read/write their restaurant data
      - Admins have full access
      - Public can read approved restaurants and reviews
*/

-- Create custom types
CREATE TYPE user_role AS ENUM ('customer', 'restaurantManager', 'admin');
CREATE TYPE booking_status AS ENUM ('pending', 'confirmed', 'cancelled', 'completed');
CREATE TYPE price_range AS ENUM ('€', '€€', '€€€', '€€€€');

-- Create users table
CREATE TABLE IF NOT EXISTS users (
  id uuid PRIMARY KEY DEFAULT auth.uid(),
  email text UNIQUE NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL,
  role user_role NOT NULL DEFAULT 'customer',
  created_at timestamptz DEFAULT now(),
  
  CONSTRAINT users_email_check CHECK (email ~* '^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$')
);

-- Create restaurants table
CREATE TABLE IF NOT EXISTS restaurants (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  name text NOT NULL,
  description text NOT NULL,
  cuisine_type text NOT NULL,
  price_range price_range NOT NULL,
  address jsonb NOT NULL,
  contact jsonb NOT NULL,
  hours jsonb NOT NULL,
  images text[] NOT NULL DEFAULT '{}',
  rating numeric DEFAULT 0 CHECK (rating >= 0 AND rating <= 5),
  booked_today int DEFAULT 0 CHECK (booked_today >= 0),
  approved boolean DEFAULT false,
  manager_id uuid REFERENCES users(id) ON DELETE SET NULL,
  created_at timestamptz DEFAULT now()
);

-- Create tables table
CREATE TABLE IF NOT EXISTS tables (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  name text NOT NULL,
  size int NOT NULL CHECK (size > 0),
  created_at timestamptz DEFAULT now()
);

-- Create reviews table
CREATE TABLE IF NOT EXISTS reviews (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  rating int NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment text NOT NULL,
  created_at timestamptz DEFAULT now(),
  
  -- One review per restaurant per user
  UNIQUE(restaurant_id, user_id)
);

-- Create bookings table
CREATE TABLE IF NOT EXISTS bookings (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  restaurant_id uuid REFERENCES restaurants(id) ON DELETE CASCADE NOT NULL,
  user_id uuid REFERENCES users(id) ON DELETE CASCADE NOT NULL,
  table_id uuid REFERENCES tables(id) ON DELETE CASCADE NOT NULL,
  date date NOT NULL,
  time time NOT NULL,
  party_size int NOT NULL CHECK (party_size > 0),
  status booking_status NOT NULL DEFAULT 'pending',
  created_at timestamptz DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE restaurants ENABLE ROW LEVEL SECURITY;
ALTER TABLE tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE bookings ENABLE ROW LEVEL SECURITY;

-- Create policies for users table
CREATE POLICY "Users can read their own data"
  ON users
  FOR SELECT
  TO authenticated
  USING (auth.uid() = id);

CREATE POLICY "Restaurant managers can read customer data for their bookings"
  ON users
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM restaurants r
      JOIN bookings b ON b.restaurant_id = r.id
      WHERE r.manager_id = auth.uid()
      AND b.user_id = users.id
    )
  );

CREATE POLICY "Admins have full access to users"
  ON users
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create policies for restaurants table
CREATE POLICY "Anyone can view approved restaurants"
  ON restaurants
  FOR SELECT
  USING (approved = true);

CREATE POLICY "Restaurant managers can manage their restaurants"
  ON restaurants
  TO authenticated
  USING (manager_id = auth.uid())
  WITH CHECK (manager_id = auth.uid());

CREATE POLICY "Admins have full access to restaurants"
  ON restaurants
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create policies for tables table
CREATE POLICY "Anyone can view tables of approved restaurants"
  ON tables
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE id = tables.restaurant_id
      AND approved = true
    )
  );

CREATE POLICY "Restaurant managers can manage their tables"
  ON tables
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE id = tables.restaurant_id
      AND manager_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE id = tables.restaurant_id
      AND manager_id = auth.uid()
    )
  );

CREATE POLICY "Admins have full access to tables"
  ON tables
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users
      WHERE id = auth.uid()
      AND role = 'admin'
    )
  );

-- Create policies for reviews table
CREATE POLICY "Anyone can read reviews"
  ON reviews
  FOR SELECT
  USING (true);

CREATE POLICY "Authenticated users can create reviews"
  ON reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own reviews"
  ON reviews
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own reviews"
  ON reviews
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Create policies for bookings table
CREATE POLICY "Users can view their own bookings"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (user_id = auth.uid());

CREATE POLICY "Restaurant managers can view bookings for their restaurants"
  ON bookings
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE id = bookings.restaurant_id
      AND manager_id = auth.uid()
    )
  );

CREATE POLICY "Users can create bookings"
  ON bookings
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own bookings"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Restaurant managers can update bookings for their restaurants"
  ON bookings
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE id = bookings.restaurant_id
      AND manager_id = auth.uid()
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM restaurants
      WHERE id = bookings.restaurant_id
      AND manager_id = auth.uid()
    )
  );

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS restaurants_manager_id_idx ON restaurants(manager_id);
CREATE INDEX IF NOT EXISTS restaurants_approved_idx ON restaurants(approved);
CREATE INDEX IF NOT EXISTS restaurants_cuisine_type_idx ON restaurants(cuisine_type);
CREATE INDEX IF NOT EXISTS tables_restaurant_id_idx ON tables(restaurant_id);
CREATE INDEX IF NOT EXISTS reviews_restaurant_id_idx ON reviews(restaurant_id);
CREATE INDEX IF NOT EXISTS reviews_user_id_idx ON reviews(user_id);
CREATE INDEX IF NOT EXISTS bookings_restaurant_id_idx ON bookings(restaurant_id);
CREATE INDEX IF NOT EXISTS bookings_user_id_idx ON bookings(user_id);
CREATE INDEX IF NOT EXISTS bookings_date_idx ON bookings(date);
CREATE INDEX IF NOT EXISTS bookings_status_idx ON bookings(status);

-- Create function to update restaurant rating
CREATE OR REPLACE FUNCTION update_restaurant_rating()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE restaurants
  SET rating = (
    SELECT ROUND(AVG(rating)::numeric, 1)
    FROM reviews
    WHERE restaurant_id = NEW.restaurant_id
  )
  WHERE id = NEW.restaurant_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update restaurant rating
CREATE TRIGGER update_restaurant_rating_trigger
AFTER INSERT OR UPDATE OR DELETE ON reviews
FOR EACH ROW
EXECUTE FUNCTION update_restaurant_rating();

-- Create function to update booked_today count
CREATE OR REPLACE FUNCTION update_booked_today()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE restaurants
  SET booked_today = (
    SELECT COUNT(*)
    FROM bookings
    WHERE restaurant_id = NEW.restaurant_id
    AND date = CURRENT_DATE
    AND status = 'confirmed'
  )
  WHERE id = NEW.restaurant_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update booked_today count
CREATE TRIGGER update_booked_today_trigger
AFTER INSERT OR UPDATE OR DELETE ON bookings
FOR EACH ROW
EXECUTE FUNCTION update_booked_today();
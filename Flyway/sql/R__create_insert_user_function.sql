CREATE OR REPLACE FUNCTION content.insert_or_update_user(p_first_name TEXT, p_last_name TEXT) 
RETURNS VOID AS $$
BEGIN
  -- Always insert a new user, avoid the condition if updating
  INSERT INTO content.users (first_name, last_name) 
  VALUES (p_first_name, p_last_name)
  ON CONFLICT (id) 
  DO UPDATE SET first_name = p_first_name, last_name = p_last_name; -- Optional: Update if conflict happens
END;
$$ LANGUAGE plpgsql;

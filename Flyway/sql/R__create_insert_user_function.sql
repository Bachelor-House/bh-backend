CREATE OR REPLACE FUNCTION content.insert_or_update_user(p_first_name TEXT, p_last_name TEXT) 
RETURNS VOID AS $$
BEGIN
  IF EXISTS (SELECT 1 FROM content.users) THEN
    UPDATE content.users SET first_name = p_first_name, last_name = p_last_name WHERE id = (SELECT id FROM content.users LIMIT 1);
  ELSE
    INSERT INTO content.users (first_name, last_name) VALUES (p_first_name, p_last_name);
  END IF;
END;
$$ LANGUAGE plpgsql;

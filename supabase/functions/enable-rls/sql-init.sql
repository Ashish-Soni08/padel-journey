
-- This SQL will be executed when we deploy the function
-- Create function to enable RLS and set REPLICA IDENTITY with fixed search path
CREATE OR REPLACE FUNCTION public.enable_realtime_for_table(table_name text)
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Set the replica identity to full for the specified table
  EXECUTE format('ALTER TABLE public.%I REPLICA IDENTITY FULL', table_name);
  
  -- Enable Row Level Security for the table
  EXECUTE format('ALTER TABLE public.%I ENABLE ROW LEVEL SECURITY', table_name);
  
  -- Add the table to the supabase_realtime publication
  EXECUTE format('ALTER PUBLICATION supabase_realtime ADD TABLE public.%I', table_name);
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error enabling realtime for table %: %', table_name, SQLERRM;
    RETURN false;
END;
$$;

-- Create dedicated function to enable RLS specifically for matches table
CREATE OR REPLACE FUNCTION public.enable_rls_for_matches()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Enable Row Level Security directly for matches table
  EXECUTE 'ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY';
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error enabling RLS for matches: %', SQLERRM;
    RETURN false;
END;
$$;

-- Create function to add a select policy for matches table
CREATE OR REPLACE FUNCTION public.create_select_policy_for_matches()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Drop policy if it exists
  BEGIN
    EXECUTE 'DROP POLICY IF EXISTS select_matches ON public.matches';
  EXCEPTION WHEN OTHERS THEN
    -- Policy doesn't exist, continue
  END;
  
  -- Create policy for selecting matches (all authenticated users can see all matches)
  EXECUTE 'CREATE POLICY select_matches ON public.matches FOR SELECT TO authenticated USING (true)';
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating select policy: %', SQLERRM;
    RETURN false;
END;
$$;

-- Create function to add an insert policy for matches table
CREATE OR REPLACE FUNCTION public.create_insert_policy_for_matches()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Drop policy if it exists
  BEGIN
    EXECUTE 'DROP POLICY IF EXISTS insert_matches ON public.matches';
  EXCEPTION WHEN OTHERS THEN
    -- Policy doesn't exist, continue
  END;
  
  -- Create policy for inserting matches (authenticated users can add matches)
  EXECUTE 'CREATE POLICY insert_matches ON public.matches FOR INSERT TO authenticated WITH CHECK (true)';
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating insert policy: %', SQLERRM;
    RETURN false;
END;
$$;

-- Create function to add an update policy for matches table
CREATE OR REPLACE FUNCTION public.create_update_policy_for_matches()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Drop policy if it exists
  BEGIN
    EXECUTE 'DROP POLICY IF EXISTS update_matches ON public.matches';
  EXCEPTION WHEN OTHERS THEN
    -- Policy doesn't exist, continue
  END;
  
  -- Create policy for updating matches (authenticated users can update matches)
  EXECUTE 'CREATE POLICY update_matches ON public.matches FOR UPDATE TO authenticated USING (true)';
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating update policy: %', SQLERRM;
    RETURN false;
END;
$$;

-- Create function to add a delete policy for matches table
CREATE OR REPLACE FUNCTION public.create_delete_policy_for_matches()
RETURNS boolean
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
  -- Drop policy if it exists
  BEGIN
    EXECUTE 'DROP POLICY IF EXISTS delete_matches ON public.matches';
  EXCEPTION WHEN OTHERS THEN
    -- Policy doesn't exist, continue
  END;
  
  -- Create policy for deleting matches (authenticated users can delete matches)
  EXECUTE 'CREATE POLICY delete_matches ON public.matches FOR DELETE TO authenticated USING (true)';
  
  RETURN true;
EXCEPTION
  WHEN OTHERS THEN
    RAISE NOTICE 'Error creating delete policy: %', SQLERRM;
    RETURN false;
END;
$$;

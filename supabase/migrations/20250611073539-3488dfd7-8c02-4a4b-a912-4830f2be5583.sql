
-- Enable RLS on the matches table if not already enabled
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;

-- Create a policy to allow anyone to read matches (since this is a personal padel tracker)
CREATE POLICY "Allow public read access to matches" 
ON public.matches 
FOR SELECT 
USING (true);

-- Create a policy to allow anyone to insert matches
CREATE POLICY "Allow public insert access to matches" 
ON public.matches 
FOR INSERT 
WITH CHECK (true);

-- Create a policy to allow anyone to update matches
CREATE POLICY "Allow public update access to matches" 
ON public.matches 
FOR UPDATE 
USING (true);

-- Create a policy to allow anyone to delete matches
CREATE POLICY "Allow public delete access to matches" 
ON public.matches 
FOR DELETE 
USING (true);

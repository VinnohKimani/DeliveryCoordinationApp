DROP POLICY IF EXISTS "Dispatchers can read all users" ON public.users;
CREATE POLICY "Dispatchers can read all users" ON public.users
  FOR SELECT USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'dispatcher'
  );

DROP POLICY IF EXISTS "Dispatchers can read and update all deliveries" ON public.deliveries;
CREATE POLICY "Dispatchers can read and update all deliveries" ON public.deliveries
  FOR SELECT USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'dispatcher'
  );

DROP POLICY IF EXISTS "Dispatchers can update all deliveries" ON public.deliveries;
CREATE POLICY "Dispatchers can update all deliveries" ON public.deliveries
  FOR UPDATE USING (
    (auth.jwt() -> 'user_metadata' ->> 'role') = 'dispatcher'
  );

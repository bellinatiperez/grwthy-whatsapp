-- Migrate existing instances to business_accounts
-- Group instances by business_account_id, create one business_account per WABA

INSERT INTO business_accounts (id, name, business_account_id, access_token, created_at, updated_at)
SELECT DISTINCT ON (business_account_id)
  gen_random_uuid()::text,
  'Business Account ' || business_account_id,
  business_account_id,
  access_token,
  MIN(created_at) OVER (PARTITION BY business_account_id),
  now()
FROM instances
WHERE business_account_id IS NOT NULL
ON CONFLICT (business_account_id) DO NOTHING;

-- Set business_account_ref_id on instances
UPDATE instances i
SET business_account_ref_id = ba.id
FROM business_accounts ba
WHERE i.business_account_id = ba.business_account_id
  AND i.business_account_ref_id IS NULL;

-- Create account members (owners) from instance userId
INSERT INTO business_account_members (id, business_account_id, user_id, role, created_at)
SELECT DISTINCT ON (ba.id, i.user_id)
  gen_random_uuid()::text,
  ba.id,
  i.user_id,
  'owner',
  now()
FROM instances i
JOIN business_accounts ba ON i.business_account_id = ba.business_account_id
WHERE i.user_id IS NOT NULL
ON CONFLICT ON CONSTRAINT bam_account_user_unique DO NOTHING;

-- Set business_account_ref_id on templates
UPDATE templates t
SET business_account_ref_id = i.business_account_ref_id
FROM instances i
WHERE t.instance_id = i.id
  AND t.business_account_ref_id IS NULL;

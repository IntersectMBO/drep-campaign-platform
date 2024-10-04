export const getVoterDelegationHistory = `
WITH LatestDrepDistr AS (
    SELECT 
      dh.view AS drep_id, 
      bk.time, 
      bk.epoch_no AS delegation_epoch, 
      dd.epoch_no AS current_epoch,
      dd.amount AS voting_power,
SUBSTRING(CAST(tx.hash AS TEXT), 3) as tx_hash,
      ROW_NUMBER() OVER (PARTITION BY dh.id ORDER BY dd.epoch_no DESC) AS row_num
    FROM 
      delegation_vote AS dv
    JOIN 
      stake_address AS sa ON sa.id = dv.addr_id
    JOIN 
      drep_hash AS dh ON dh.id = dv.drep_hash_id
    LEFT JOIN 
      drep_distr AS dd ON dd.hash_id = dh.id
    JOIN 
      tx ON tx.id = dv.tx_id
    JOIN 
      tx_out ON tx.id = tx_out.tx_id
    JOIN 
      block AS bk ON bk.id = tx.block_id
    WHERE 
      sa.view = $1
      
)
SELECT 
tx_hash,
  drep_id, 
  time, 
  current_epoch, 
  delegation_epoch,
  voting_power,
  row_num
FROM 
  LatestDrepDistr
WHERE 
  row_num = 1
ORDER BY 
  time DESC
`
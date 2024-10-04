export const drepRegistrationQuery = `
    SELECT dh.view,dr.deposit,dr.tx_id,  
            ROW_NUMBER() OVER (PARTITION BY drep_hash_id ORDER BY tx_id DESC) AS rn
    FROM drep_hash dh
    JOIN drep_registration dr ON dh.id = dr.drep_hash_id
    where dh.view = $1 
    limit 1`;

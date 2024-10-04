export const getLatestBlock = `
SELECT 
    SUBSTRING(CAST(block.hash AS TEXT) FROM 3) AS hash,
    epoch_no,
    slot_no,
    epoch_slot_no,
    block_no,
    previous_id,
    ph.view as slot_leader,
    size,
    time,
    tx_count,
    proto_major,
    proto_minor,
    vrf_key,
    SUBSTRING(CAST(op_cert AS TEXT) FROM 3) AS op_cert,
    op_cert_counter
FROM "block"
JOIN slot_leader as sl ON block.slot_leader_id = sl.id
JOIN pool_hash as ph ON sl.pool_hash_id = ph.id
ORDER BY block."id" DESC
LIMIT 1`;

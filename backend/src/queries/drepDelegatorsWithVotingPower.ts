export const getDrepDelegatorsWithVotingPowerQuery = (
  itemsPerPage: number,
  offset?: number,
  orderByClause?: string
) => `
    WITH latest_delegations AS (
        SELECT delegation_vote.addr_id, MAX(block.time) AS latest_time
        FROM drep_hash
        JOIN delegation_vote ON delegation_vote.drep_hash_id = drep_hash.id
        JOIN stake_address ON delegation_vote.addr_id = stake_address.id
        JOIN tx ON delegation_vote.tx_id = tx.id
        JOIN block ON tx.block_id = block.id
        WHERE drep_hash.view = $1
        GROUP BY delegation_vote.addr_id
    )
    SELECT sa.view AS stake_address,
       b.epoch_no AS delegation_epoch,
       COALESCE(SUM(txo.value), 0) AS voting_power
    FROM drep_hash AS dh
           JOIN delegation_vote AS dv ON dh.id = dv.drep_hash_id
           JOIN stake_address sa ON dv.addr_id = sa.id
           JOIN tx ON dv.tx_id = tx.id
           JOIN block b ON tx.block_id = b.id
           JOIN latest_delegations ld ON dv.addr_id = ld.addr_id
    AND b.time = ld.latest_time
    JOIN tx_out txo ON sa.id = txo.stake_address_id AND txo.consumed_by_tx_id IS NULL
    GROUP BY sa.view,
         b.epoch_no
    ${orderByClause}
    LIMIT ${itemsPerPage}
    OFFSET ${offset}
`;

export const getDrepDelegatorsCountQuery = () => `
    WITH latest_delegations AS (
        SELECT delegation_vote.addr_id, MAX(block.time) AS latest_time
        FROM drep_hash
        JOIN delegation_vote ON delegation_vote.drep_hash_id = drep_hash.id
        JOIN stake_address ON delegation_vote.addr_id = stake_address.id
        JOIN tx ON delegation_vote.tx_id = tx.id
        JOIN block ON tx.block_id = block.id
        WHERE drep_hash.view = $1
        GROUP BY delegation_vote.addr_id
    )
    SELECT COUNT(DISTINCT sa.id) AS total
    FROM drep_hash AS dh
           JOIN delegation_vote AS dv ON dh.id = dv.drep_hash_id
           JOIN stake_address sa ON dv.addr_id = sa.id
           JOIN tx ON dv.tx_id = tx.id
           JOIN block b ON tx.block_id = b.id
           JOIN latest_delegations ld ON dv.addr_id = ld.addr_id
    AND b.time = ld.latest_time
`;

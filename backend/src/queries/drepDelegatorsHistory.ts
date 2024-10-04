export const getDRepDelegatorsHistory = (addrIds: []) => {
  const addrIdsCondition =
    addrIds.length > 0
      ? `WHERE
    dva.addr_id IN (${addrIds.join(',')})
    AND (current_drep.id = $1 OR previous_drep.id = $1)
    AND b.time::DATE BETWEEN $4::DATE AND $3::DATE`
      : `WHERE
    (current_drep.id = $1 OR previous_drep.id = $1)
    AND b.time::DATE BETWEEN $4::DATE AND $3::DATE`;

  return `
    SELECT 
        sa.view AS stake_address,
        $2::TEXT AS target_drep,
        current_drep.view AS current_drep,
        previous_drep.view AS previous_drep,
        b.time AS timestamp,
        b.epoch_no AS delegation_epoch,
        SUBSTRING(CAST(tx.hash AS TEXT) FROM 3) AS tx_hash,
        'delegation' AS type,
        (
            (
                SELECT COALESCE(SUM(txo.value), 0)
                FROM tx_out txo
                LEFT JOIN tx ON txo.tx_id = tx.id
                LEFT JOIN block b2 ON tx.block_id = b2.id
                LEFT JOIN tx_in txi ON (txo.tx_id = txi.tx_out_id AND txo.index = txi.tx_out_index)
                WHERE txi IS NULL
                AND txo.stake_address_id = sa.id
                AND b2.time::DATE <= b.time::DATE
            ) 
            + COALESCE(
                (
                    SELECT SUM(amount)
                    FROM reward
                    WHERE addr_id = sa.id
                    AND earned_epoch <= b.epoch_no
                    AND type <> 'refund'
                ), 0
            ) 
            + COALESCE(
                (
                    SELECT SUM(amount)
                    FROM reward_rest
                    WHERE addr_id = sa.id
                    AND earned_epoch <= b.epoch_no
                ), 0
            ) 
            + COALESCE(
                (
                    SELECT SUM(amount)
                    FROM reward
                    WHERE addr_id = sa.id
                    AND earned_epoch <= b.epoch_no
                    AND type = 'refund'
                ), 0
            ) 
            - COALESCE(
                (
                    SELECT SUM(amount)
                    FROM withdrawal
                    LEFT JOIN tx tx_w ON withdrawal.tx_id = tx_w.id
                    LEFT JOIN block b2 ON tx_w.block_id = b2.id
                    WHERE addr_id = sa.id
                    AND b2.epoch_no <= b.epoch_no
                ), 0
            )
        )::TEXT AS total_stake,
        CASE 
            WHEN current_drep.view = $2 THEN true
            ELSE false
        END AS added_power
    FROM 
        delegation_vote dva
    LEFT JOIN 
        delegation_vote dvb 
    ON 
        dva.addr_id = dvb.addr_id 
        AND dvb.tx_id = (
            SELECT MAX(tx_id) 
            FROM delegation_vote 
            WHERE addr_id = dva.addr_id 
            AND tx_id < dva.tx_id
        )
    JOIN 
        stake_address sa 
    ON 
        dva.addr_id = sa.id
    LEFT JOIN 
        tx 
    ON 
        dva.tx_id = tx.id
    LEFT JOIN 
        block b 
    ON 
        tx.block_id = b.id
    LEFT JOIN 
        drep_hash current_drep 
    ON 
        dva.drep_hash_id = current_drep.id
    LEFT JOIN 
        drep_hash previous_drep 
    ON 
        dvb.drep_hash_id = previous_drep.id

        ${addrIdsCondition}
    ORDER BY 
        b.time DESC;`;
};

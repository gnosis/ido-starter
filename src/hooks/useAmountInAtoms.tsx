import { BigNumber, utils } from 'ethers'
import { useEffect, useState } from 'react'

export const useAmountInAtoms = (amount: BigNumber, decimals: number) => {
  const [atoms, setAtoms] = useState<BigNumber>(BigNumber.from('0'))

  useEffect(() => {
    const atoms = utils.parseUnits(amount.toString(), decimals)
    setAtoms(atoms)
  }, [amount, decimals])

  return atoms
}

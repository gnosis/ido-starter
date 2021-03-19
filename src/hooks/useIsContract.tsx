import { useEffect, useState } from 'react'

import { useSafeAppsSDK } from '@gnosis.pm/safe-apps-react-sdk'

import { ADDRESS_REGEX } from '../utils'

export const useIsContract = (address: string) => {
  const { safe, sdk } = useSafeAppsSDK()

  const [isContract, setIsContract] = useState(false)

  useEffect(() => {
    const fetchCode = async () => {
      try {
        const code = await sdk.eth.getCode([address])
        const isContract = code !== '0x'
        setIsContract(isContract)
      } catch (e) {
        console.error('Error checking for code', e)
      }
    }

    if (address && ADDRESS_REGEX.test(address)) {
      fetchCode()
    }
  }, [address, safe, sdk])

  return isContract
}

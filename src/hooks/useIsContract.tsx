// eslint-disable-next-line no-warning-comments
// TODO sdk should be SafeInfoSDK
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const checkIsContract = async (sdk: any, address: string): Promise<boolean> => {
  try {
    const code = await sdk.eth.getCode([address])
    const isContract = code !== '0x'
    return isContract
  } catch (e) {
    console.error('Error checking for code', e)
    return false
  }
}

// let isCancelled = false

// export const useIsContract = (address: string) => {
//   const { safe, sdk } = useSafeAppsSDK()

//   const [isContract, setIsContract] = useState(false)
//   useEffect(() => {
//     isCancelled = false
//     if (address && ADDRESS_REGEX.test(address)) {
//       checkIsContract(sdk, address).then((isContract) => {
//         if (!isCancelled) setIsContract(isContract)
//       })
//     }

//     return () => {
//       isCancelled = true
//     }
//   }, [address, safe, sdk])

//   return isContract
// }

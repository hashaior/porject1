/**
 * Static account data. Per the home-screen spec there is no dynamic data to
 * load yet — replace this with a real source once the wallet API is defined.
 */
export const account = {
  balance: 1250,
}

const numberFormat = new Intl.NumberFormat('en-US')

export function formatBalance(value: number): string {
  return numberFormat.format(value)
}

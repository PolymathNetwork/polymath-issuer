export type SPStatus = {|
  title: string,
    message: string,
|}

export type SPProgress = {|
  isApplied: boolean,
    status ?: SPStatus,
|}

export type ServiceProvider = {|
  id: number,
    cat: number,
      title: string,
        logo: string,
          desc: string,
            progress ?: SPProgress,
            disclosure ?: string,
            isToBeAnnounced ?: boolean,
            isIncreasedHeight ?: boolean,
|}

export type SPCategory = {|
  id: number,
    title: string,
      desc: string,
|}

export const statuses = [
  'Selected as Provider',
  'Provider Declined',
  'Other',
]

export const categories: Array<SPCategory> = [
  {
    id: 0,
    title: 'Advisory',
    desc: 'Advisory firms may help you plan and execute your STO. Your Polymath dashboard is integrated with the ' +
      'following Advisory firms. Alternatively, you can elect to use your own Advisory services.',
  },
  {
    id: 1,
    title: 'Legal',
    desc: 'Law firms may advise you on the planning and execution of your STO. Your Polymath dashboard is integrated' +
      'with the following Law firms. Alternatively, you can elect to use your own Law firm or General Counsel.',
  },
  {
    id: 2,
    title: 'KYC/AML',
    desc: 'KYC is a critical component to your STO that will enable you to establish the list of approved ' +
      'transactors for your token. Alternatively, you can elect to use your own KYC firm.',
  },
  {
    id: 3,
    title: 'Marketing',
    desc: 'Apply for Marketing/PR Agency to help drive engagement and promote your STO. ' +
      'Alternatively, you can elect to use your own Marketing/PR firm or staff.',
  },
  {
    id: 4,
    title: 'Custody Service',
    desc: 'Apply for Custody services for the funds you raised and/or your investors\' ' +
      'security tokens to be held for safekeeping and minimize the risk of theft or loss. Alternatively, ' +
      'you and/or your Investors can elect to self custody funds and security tokens.'
    ,
  },
]

const providers: Array<ServiceProvider> = [

  // ADVISORY
  {
    id: 1,
    cat: 0,
    title: 'GenesisBlock',
    logo: '/providers/advisory/genesisblock.png',
    background:'/providers/advisory/bg/img-genesisblock.png',
    desc: 'Genesis Block provides strategic business and regulatory advisory, financial services,' +
      'and technology solutions to companies seeking to leverage blockchain technology in their core ' +
      'business and capital strategy. Our mission is to realize the disruptive potential of blockchain ' +
      'and foster its growth and adoption in every aspect of life.',
  },
  {
    id: 2,
    cat: 0,
    title: 'Matador',
    logo: '/providers/advisory/matador.png',
    background:'/providers/advisory/bg/img-matador.png',
    desc: 'We started as investment bankers and private equity partners. Historically, private markets provide' +
      ' minimal liquidity and going public carries high costs. Working at Polymath, we saw that the blockchain could' +
      ' solve many of these problems from legacy capital markets.',
    disclosure: 'Matador is a Polymath company',
  },
  {
    id: 3,
    cat: 0,
    title: 'Pegasus',
    logo: '/providers/advisory/pegasus.png',
    background: '/providers/advisory/bg/img-pegasus.png',
    desc: 'The Pegasus Accelerator Program provides Blockchain and Token consulting and support services. ' +
      'Token offerings are compliant with jurisdictional regulations through the PIBCO process.',
  },
  {
    id: 17,
    cat: 0,
    title: 'Tokenizo',
    logo: '/providers/advisory/tokenizo.png',
    background:'/providers/advisory/bg/img-tokenizo.png',
    desc: 'We are an end-to-end service for the tokenization of assets using blockchain, focused on the ' +
      'Latin American and Southern Europe markets.\nTokenizo is an Investment Bank 2.0. We combine in-country ' + 'affiliates with world class technology partners. This new way of Banking will preserve the high ' +
      'standards of personalized service with the added benefit of  technology in a way that has never '+
      'been done before:\n- We will continually develop a technology ecosystem and partner with best of ' +
      'class service providers that will allow to meet regulatory requirements to issue securities by using ' +
      'a tokenized asset, traded in a token exchange.\n- Our Local affiliates will provide in-country service ' +
      'and communications while our Corporate team focuses on the interaction with our technology ecosystem.',
  },

  // LEGAL
  {
    id: 5,
    cat: 1,
    title: 'Homeier Law PC',
    logo: '/providers/legal/homierlaw.png',
    background: '/providers/legal/bg/img-homier.png',
    desc: 'Homeier Law PC is a securities and corporate law firm with deep experience in exempt as well as ' +
      'SEC-registered alternative finance offerings, having advised on hundreds of private offerings that have ' +
      'raised billions of dollars for developers and entrepreneurs over the past decade.  As a leader and ' +
      'pioneer ininvestment crowdfunding, Homeier Law serves the emerging blockchain and cryptocurrency industries ' +
      'in structuring and documenting initial coin offerings (ICOs), tokenized security offerings and ' +
      'other capital-raising initiatives.',
  },

  // KYC/AML
  {
    id: 11,
    cat: 2,
    title: 'Katipult',
    logo: '/providers/kyc/katipult.png',
    background: '/providers/kyc/bg/img-katipult.png',
    desc: 'At Katipult, we come to work each day because we want to solve some of the biggest pain points for our ' +
      'clients working in the private capital markets. Most firms aren\'t capitalizing on opportunities in today\'s ' +
      'markets because they are still using manual systems...',
  },

  // MARKETING
  {
    id: 13,
    cat: 3,
    title: 'Wachsman PR',
    logo: '/providers/marketing/wachsmanpr.png',
    background: '/providers/marketing/bg/img-wachsman.png',
    desc: 'Wachsman provides media relations, strategic communications, brand development, and corporate advisory ' +
      'services to many of the most indispensable companies in the financial technology, digital currency, and ' +
      'crypto-asset sectors.',
  },

  // CUSTODY SERVICE
  {
    id: 15,
    cat: 4,
    title: 'BitGo',
    logo: '/providers/custody/bitgo.png',
    background: '/providers/custody/bg/img-bitgo.png',
    desc: 'BitGo is a blockchain software company that secures digital currency for institutional investors. Its ' +
      'technology solves the most difficult security, compliance and custodial problems ' +
      'associated with blockchain-based currencies, enabling the integration of digital currency into the global…',
  },
  {
    id: 16,
    cat: 4,
    title: 'Prime Trust',
    logo: '/providers/custody/primetrust.png',
    background: '/providers/custody/bg/img-primetrust.png',
    desc: 'Prime Trust is chartered, insured financial institution that as a "Qualified Custodian" provides ' +
      'token and FIAT custody, funds processing, AML/KYC compliance, and transaction technology for the new ' +
      'digital economy. As a blockchain-based trust company our mission is to provide ICO and SCO issuers with ' +
      'the best-in-class solutions to frictionlessly meet the needs of their offerings and of exchanges ' +
      'and secondary markets.',
  },
]

export const getProviders = () => {
  providers.sort((a: ServiceProvider, b: ServiceProvider) => {
    const textA = a.title.toUpperCase()
    const textB = b.title.toUpperCase()
    if (a.isToBeAnnounced && b.isToBeAnnounced) {
      return 0
    } else if (a.isToBeAnnounced) {
      return 1
    } else if (b.isToBeAnnounced) {
      return -1
    }
    return (textA < textB) ? -1 : (textA > textB) ? 1 : 0
  })
  return providers
}

export const getProgress = (ticker: string): Array<SPProgress> => {
  return JSON.parse(String(localStorage.getItem('providers-' + ticker))) || []
}

export const saveProgress = (ticker: string, progress: Array<SPProgress>) => {
  localStorage.setItem('providers-' + ticker, JSON.stringify(progress))
}

export const isProvidersPassed = (providers: ?Array<ServiceProvider>) => {
  let isProvidersPassed = true
  if (providers) {
    for (let p: ServiceProvider of providers) {
      if (p.cat === 0) { // only cat 0 is obligatory
        if (p.progress && p.progress.isApplied) {
          isProvidersPassed = true
          break
        }
        if (!p.progress) {
          isProvidersPassed = false
        }
      }
    }
  } else {
    isProvidersPassed = false
  }
  return isProvidersPassed
}

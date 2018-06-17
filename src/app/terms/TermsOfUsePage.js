import React, { Component } from 'react'

import { Terms } from 'polymath-ui'

export default class TermsOfUse extends Component {
  render () {

    const linkItems = [
      {
        title: 'Modification of Terms',
        body:
  <p>These Terms of Service and any terms expressly incorporated herein
             (“Terms”) apply to any access to, or use of, any services made available by
             Polymath Studios Inc. (“Studios”) using the website or decentralized application
              layer (collectively, the “dApp”), and to any other related services provided
              by Studios (collectively, the “Services”). By clicking on an “I Agree” button
              or checkbox presented with these Terms or, if earlier, by accessing or using
              any Services, you agree to be bound by these Terms.THE ARBITRATION CLAUSE
              IN SECTION 18 GOVERNS RESOLUTION OF CERTAIN DISPUTES.
  </p>,
      },
      {
        title: 'Eligibility',
        body:
  <p>General Requirements. The Services are intended solely for users who are
             18 or older and who satisfy the criteria described in these Terms. You represent
            and warrant that you: (a) are of legal age to form a binding contract (at least
            18 years old); (b) have not previously been suspended or removed from using our
            Services; (c) are not identified as a “Specially Designated National” by the
            Office of Foreign Assets Control; (d) are not placed on the U.S. Commerce
            Department’s Denied Persons List; and (e) have full power and authority
            to agree to these Terms.Restricted Locations. You may not use the
            Services if you are located in, or a citizen or resident of any state,
            country, territory or other jurisdiction that is embargoed by the United
            States or where your use of the Services would be illegal or otherwise
            violate any applicable law. You represent and warrant that you are not a
            citizen or resident of any such jurisdiction and that you will not use
            any Services while located in any such jurisdiction. You also may not use
            the Services if you are located in, or a citizen or resident of, any other
            jurisdiction where Studios has determined, at its discretion, to prohibit
            use of the Services. Studios may implement controls to restrict access to
            the Services from any jurisdiction prohibited pursuant to this Section 2.2.
            You will comply with this Section 2.2, even if Studios’s methods to prevent
             use of the Services are not effective or can be bypassed.
  </p>,
      },
      {
        title: 'Account',
        body:
  <p>These Terms of Service and any terms expressly incorporated herein (“Terms”)
          apply to any access to, or use of, any services made available by Polymath Studios
          Inc. (“Studios”) using the website or decentralized application layer (collectively,
           the “dApp”), and to any other related services provided by Studios (collectively,
           the “Services”). By clicking on an “I Agree” button or checkbox presented with
           these Terms or, if earlier, by accessing or using any Services, you agree to be
           bound by these Terms.THE ARBITRATION CLAUSE IN SECTION 18 GOVERNS RESOLUTION OF
           CERTAIN DISPUTES.
  </p>,
      },
      {
        title: 'Risk Disclosures, Assumption of Risks, Release of Studios',
        body:
  <p>These Terms of Service and any terms expressly incorporated herein (“Terms”)
            apply to any access to, or use of, any services made available by Polymath Studios
            Inc. (“Studios”) using the website or decentralized application layer (collectively,
            the “dApp”), and to any other related services provided by Studios (collectively,
            the “Services”). By clicking on an “I Agree” button or checkbox presented with
            these Terms or, if earlier, by accessing or using any Services, you agree to be
            bound by these Terms.THE ARBITRATION CLAUSE IN SECTION 18 GOVERNS RESOLUTION OF
            CERTAIN DISPUTES.
  </p>,
      },
      {
        title: 'Privacy Policy',
        body: 'Content Four',
      },
    ]

    const content = (
      <div>
        <h2 className='pui-h2'>Last updated: April 19th, 2018</h2>
        <p>
          These Terms of Service and any terms expressly incorporated herein (“Terms”) apply
          to any access to, or use of, any services made available by Polymath Studios Inc.
          (“Studios”) using the website or decentralized application layer (collectively,
          the “dApp”), and to any other related services provided by Studios
          (collectively, the “Services”). By clicking on an “I Agree” button or checkbox
          presented with these Terms or, if earlier, by accessing or using any Services,
          you agree to be bound by these Terms.
        </p>
        <p>
          THE ARBITRATION CLAUSE IN SECTION 18 GOVERNS RESOLUTION OF CERTAIN DISPUTES.
        </p>
      </div >)
    return (
      <Terms pageTitle='Terms of Use' menuItems={linkItems} headerText={content} />

    )
  }
}

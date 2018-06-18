import React, { Component } from 'react'

import { Terms } from 'polymath-ui'

export default class TermsOfUse extends Component {
  render () {

    const linkItems = [
      {
        title: 'Collection of Information',
        body: (
          <div>
            <p>These Terms of Service and any terms expressly incorporated herein
              (“Terms”) apply to any access to, or use of, any services made available by
              Polymath Studios Inc. (“Studios”) using the website or decentralized application
              layer (collectively, the “dApp”), and to any other related services provided
              by Studios (collectively, the “Services”). By clicking on an “I Agree” button
              or checkbox presented with these Terms or, if earlier, by accessing or using
              any Services, you agree to be bound by these Terms.THE ARBITRATION CLAUSE
              IN SECTION 18 GOVERNS RESOLUTION OF CERTAIN DISPUTES.
            </p>
          </div>),
      },
      {
        title: 'Use of Information',
        body: (
          <div>
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
            </p>
          </div>),
      },
      {
        title: 'Sharing of Information',
        body: (
          <div>
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
            </p>
          </div>),
      },
      {
        title: 'Social Sharing Features',
        body:
          (
            <div>
              <p>These Terms of Service and any terms expressly incorporated herein (“Terms”)
                  apply to any access to, or use of, any services made available by Polymath Studios
                                                                                                                            Inc. (“Studios”) using the website or decentralized application layer (collectively,
                                                                                                                            the “dApp”), and to any other related services provided by Studios (collectively,
                                                                                                                            the “Services”). By clicking on an “I Agree” button or checkbox presented with
                                                                                                                            these Terms or, if earlier, by accessing or using any Services, you agree to be
                                                                                                                            bound by these Terms.THE ARBITRATION CLAUSE IN SECTION 18 GOVERNS RESOLUTION OF
                                                                                                                            CERTAIN DISPUTES.
              </p>
            </div>),
      },
      {
        title: 'Consent',
        body: 'Content Four',
      },
      {
        title: 'Security',
        body: 'Content Four',
      },
      {
        title: 'Your Choices',
        body: 'Content Four',
      },
      {
        title: 'Contact Us',
        body: 'Content Four',
      },
    ]

    const content = (
      <div>
        <h2 className='pui-h2'>Last updated: May 16th, 2018</h2>
        <p>
          This Privacy Policy explains how information about you is collected, used and disclosed by
           Polymath Studios Inc. [Studios], and its subsidiaries and affiliated companies (“Studios”).
            This Privacy Policy applies to information we collect when you use our website and
            decentralized application layer (collectively, the “dApp”), and other websites,
            applications and online products and services that link to this Privacy Policy
            (collectively, the “Service”). The Service includes, among other things, the ability
             to create and design a securities token and interact with, engage and pay third-party
              service providers, all as described in our <a href='https://tokenstudio.polymath.network/termsofuse'>Terms of Service </a>
          and on our Site.

        </p>
        <p>
          We may change this Privacy Policy from time to time. If we make changes, we will notify you by
          revising the date at the top of the policy and, in some cases, we may provide you with additional
           notice (such as adding a statement to our homepage or sending you an email notification). We
           encourage you to review the Privacy Policy whenever you access the Service to stay informed
           about our information practices and the ways you can help protect your privacy.
        </p>
      </div >)
    return (
      <Terms pageTitle='Privacy Policy' menuItems={linkItems} headerText={content} />

    )
  }
}

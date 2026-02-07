import { useState } from 'react';
import '../App.css';
import artificialAdvocatesPdf from '../assets/artificial_advocates.pdf';

const portfolioData = {
  research: {
    title: 'Research',
    items: [
      {
        title: 'Artificial Advocates: Biasing Democratic Feedback Using AI',
        description: 'Lead author. Apart Research, 2025.',
        link: artificialAdvocatesPdf
      }
    ]
  },
  writing: {
    title: 'Writing',
    description: 'My most recent writing can be found on my <a href="/blog">blog</a>. Selected articles below.',
    items: [
      {
        title: "o3 Beats a Master-Level Geoguessr Player—Even with Fake EXIF Data",
        description: "Reached #1 on Hacker News",
        link: '/blog/2025-04-28-can-o3-beat-a-geoguessr-master'
      },
      {
        title: "Unc's Unlearning Outfit for 2024",
        description: "A short fiction piece that won runner up in the 2024 Interintellect Essay contest",
        link: '/blog/2025-03-03-unc-unclearning'
      },
      {
        title: "Breakdown of all Satoshi's Writings Proves Bitcoin not Built Primarily as Store of Value",
        description: '2019, with accompanying video',
        link: '/blog/2019-06-06-satoshi-analysis',
        videoEmbed: '<div class="video-container"><iframe width="560" height="315" src="https://www.youtube-nocookie.com/embed/_j3ZrS5xirw" frameborder="0" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe></div>'
      },
      {
        title: "Why I'm Hopeful About the Prospects for Bitcoin",
        description: 'Foundation for Economic Education, 2014',
        link: 'https://fee.org/resources/why-im-hopeful-about-the-prospects-for-bitcoin/'
      },
      {
        title: 'Is Bitcoin Dead (Again)?',
        description: 'Foundation for Economic Education, 2016',
        link: 'https://fee.org/articles/is-bitcoin-dead-again/'
      },
      {
        title: 'Decentralized Markets',
        description: 'Coin Center, 2015',
        link: 'https://www.coincenter.org/education/key-concepts/decentralized-markets/'
      },
      {
        title: 'Up and Running with Bitcoin',
        description: 'Liberty.me, 2014',
        link: 'https://liberty.me/wp-content/uploads/2014/06/Patterson-UpAndRunningWithBitcoin-v10.pdf'
      },
      {
        title: 'How Bitcoin Works',
        description: 'Hillsdale College Free Market Forum, 2014',
        link: 'https://www.hillsdale.edu/wp-content/uploads/2016/02/FMF-2014-How-Bitcoin-Works.pdf'
      }
    ]
  },
  book: {
    title: 'Book',
    items: [
      {
        title: 'Bitcoin Beginner',
        description: 'One of the first books published about Bitcoin (2013)',
        link: 'https://www.amazon.com/gp/product/B077BKQFYK/ref=dbs_a_def_rwt_bibl_vppi_i0'
      }
    ]
  },
  presentations: {
    title: 'Presentations',
    items: [
      {
        title: 'Now Is The Time To Shift To A Decentralized Marketplace',
        description: "Hacker's Congress, Paralelni Polis, Prague, 2017",
        link: 'https://youtu.be/m5MMK5ZARqg'
      },
      {
        title: 'Free Trade Through Decentralized Commerce',
        description: "Hacker's Congress, Paralelni Polis, Prague, 2016",
        link: 'https://commons.wikimedia.org/wiki/File:Sam_Patterson_-_OpenBazaar_-_Free_Trade_Through_Decentralized_Commerce_-_HCPP16.webm'
      },
      {
        title: 'Presentation on Bitcoin and decentralized commerce',
        description: 'PorcFest XIII, New Hampshire, 2016',
        link: null
      },
      {
        title: 'Up & Running with Bitcoin',
        description: 'Liberty.me, Online, 2014',
        link: 'https://liberty.me/live/up-running-with-bitcoin-by-sam-patterson/'
      },
      {
        title: 'How Bitcoin Works',
        description: 'Hillsdale College Free Market Forum, Panel on Bitcoin, Indianapolis, 2014',
        link: 'https://youtu.be/lRPtzZ2Lk3Y?t=1873'
      }
    ]
  },
  technicalWriting: {
    title: 'Technical Writing / Tutorials',
    items: [
      {
        title: 'OpenBazaar 2.0 video tutorial',
        description: null,
        link: 'https://youtu.be/VzlerMJMOu8?t=102'
      },
      {
        title: 'Which Cryptocurrencies are supported in OpenBazaar',
        description: '2019',
        link: 'https://web.archive.org/web/20201108001423/https://openbazaar.org/blog/which-cryptocurrencies-are-used-in-openbazaar/'
      },
      {
        title: "Beginner's Guide to Buying Goods and Services",
        description: '2018',
        link: 'https://web.archive.org/web/20181104201859/https://openbazaar.org/blog/The-Beginners-Guide-to-Buying-Goods-Services-and-Cryptocurrency-on-OpenBazaar/'
      }
    ]
  },
  art: {
    title: 'Art',
    items: [
      {
        title: 'The Sound of Progress',
        description: 'Video/audio project highlighting the improving state of the world, 2019',
        link: 'https://youtu.be/NJldNUN-WbE'
      },
      {
        title: 'Amulets',
        description: 'Computer-generated poetry - I wrote a python program to create short poems with a unique hash',
        link: 'https://opensea.io/sampatt'
      },
      {
        title: 'AI Images',
        description: "I've been experimenting with using AI to create or enhance images, particularly my landscape photography"
      }
    ]
  },
  media: {
    title: 'Media',
    items: [
      {
        title: 'Bitcoin Without Internet',
        description: 'School of Block - Mar 2021',
        link: 'https://youtu.be/6mFu8h3rkc'
      },
      {
        title: 'CryptoEcon 2020 - Interview Sam Patterson (Co-Founder OpenBazaar)',
        description: 'CryptoEcon Conference, Saigon, Vietnam - Feb 2020',
        link: 'https://bitcoinsaigon.org/interview-sam-patterson/'
      },
      {
        title: 'A Conversation on Technology and Liberty',
        description: 'The Antigua Forum, Universidad Francisco Marroquín, Guatemala - 2017',
        link: 'https://newmedia.ufm.edu/coleccion/the-antigua-forum/a-conversation-on-technology-and-liberty/'
      },
      {
        title: 'OpenBazaar',
        description: 'TheProtocol.TV - September 2014',
        link: 'https://youtu.be/RPxpY_6czRU'
      },
      {
        title: 'OpenBazaar in Depth: Interview with COO Sam Patterson',
        description: '2015',
        link: 'https://bitcoinist.com/openbazaar-in-depth-interview-with-coo-sam-patterson/'
      },
      {
        title: 'Redecentralize Sam Patterson',
        description: 'Oct 2016',
        link: 'https://redecentralize.org/interviews/2016/10/10/21-sam-patterson-openbazaar.html'
      }
    ]
  },
  mediaQuotes: {
    title: 'Media Quotes',
    items: [
      {
        title: 'Bitcoin Sent Offline from Toronto to Michigan Through Shortwave Radio',
        description: 'Crypto Vibes - Feb 2019',
        link: 'https://www.cryptovibes.com/blog/2019/02/13/bitcoin-transaction-shortwave-radio/'
      },
      {
        title: "Creators of New Fed-Proof Bitcoin Marketplace Swear It's Not for Drugs",
        description: 'Wired - Sept 2014',
        link: 'https://www.wired.com/2014/08/openbazaar-not-for-drugs/'
      },
      {
        title: 'OpenBazaar Is Not The Next Silk Road -- It\'s An Anarchist eBay On Acid',
        description: 'Forbes - Mar 2016',
        link: 'https://www.forbes.com/sites/thomasbrewster/2016/03/16/openbazaar-silk-road-dark-web-drugs-ebay/?sh=373f64f85ab4'
      },
      {
        title: 'OpenBazaar Raises $1M from Andreessen Horowitz, Union Square Ventures',
        description: 'Finance Magnates - Nov 2015',
        link: 'https://www.financemagnates.com/cryptocurrency/news/openbazaar-raises-1m-from-andreessen-horowitz-union-square-ventures/'
      },
      {
        title: 'Bitcoin\'s Use Case for Payments Strengthens with Lightning-Powered App',
        description: 'Yahoo - July 2019',
        link: 'https://www.yahoo.com/now/bitcoin-apos-case-payments-strengthens-180049450.html'
      }
    ]
  }
};

function PortfolioSection({ title, description, items }) {
  return (
    <div className="portfolio-section">
      <h2>{title}</h2>
      {description && <div className="section-description" dangerouslySetInnerHTML={{ __html: description }} />}
      <div className="portfolio-items">
        {items.map((item, index) => (
          <div key={index} className="portfolio-item">
            <h3>
              {item.link ? (
                <a href={item.link} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              ) : (
                item.title
              )}
            </h3>
            {item.description && <p>{item.description}</p>}
            {item.videoEmbed && (
              <div dangerouslySetInnerHTML={{ __html: item.videoEmbed }} />
            )}
            {item.image && <img src={item.image} alt={item.title} style={{ maxWidth: '400px' }} />}
          </div>
        ))}
      </div>
    </div>
  );
}

function Portfolio() {
  return (
    <div className="primary-container">
      <h4 style={{ color: 'var(--text-muted)', marginBottom: '0.5rem' }}>Portfolio & Media</h4>
      <div className="portfolio-container">
        {Object.entries(portfolioData).map(([key, section]) => (
          <PortfolioSection
            key={key}
            title={section.title}
            description={section.description}
            items={section.items}
          />
        ))}
      </div>
    </div>
  );
}

export default Portfolio;

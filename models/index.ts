// "numFound": 407,
// "start": 0,
// "numFoundExact": true,
// "num_found": 407,
// "documentation_url": "https://openlibrary.org/dev/docs/api/search",
// "q": "asd",
// "offset": null,
// docs: [{

//     "author_key": [
//       "OL23919A"
//     ],
//     "author_name": [
//       "J. K. Rowling"
//     ],
//     "cover_edition_key": "OL22856696M",
//     "cover_i": 10521270,
//     "edition_count": 339,
//     "first_publish_year": 1997,
//     "has_fulltext": true,
//     "ia": [
//       "harrypotterylapi0000rowl_q5r6",
//       "harrypotterylapi0000rowl_d7v1",
//       "haliboteshenmide0000rowl",
//       "harrypotterundde0000jkro",
//       "harrypotterlcole0000unse",
//       "harrypotteriharr0000jkro",
//       "harrypottersorce0000rowl_h8m5",
//       "haliboteyumofash0000rowl",
//       "harrypotterphilo0000jkro",
//       "harrypotterikami0000jkro",
//       "harrypotterogdev0000rowl",
//       "harrypotterkamen0000rowl",
//       "lccn_078073006991",
//       "harrypottersorce0000unse",
//       "harrypotteresbol0000rowl",
//       "harrypottersorce0000rowl_a6t2",
//       "harrypotterylapi0000rowl",
//       "harrypottermagic0000rowl_p4p3",
//       "harrypotteraleco0000rowl",
//       "harrypottersorce0000rowl_t5a1",
//       "harrypottersorce0000rowl_l6l8",
//       "harrypottersorce0000rowl_i9p5",
//       "harrypottersorce0000rowl_1998",
//       "harrypottersorce0000rowl",
//       "harrypotterylapi0000jkro",
//       "harrypotterphilo0000rowl_d8d4",
//       "harrypotterphilo0000rowl_i7z2",
//       "harriuspotteretp0000rowl",
//       "harrypotterphilo0000rowl_k0s6",
//       "haripattervasang0000rowl",
//       "areiospoterkaihe00rowl",
//       "harrypotterelapi00jkro",
//       "harrypottersorce00rowl_1",
//       "harrypottersorce00jkro_0",
//       "harrypotterylapi00",
//       "haripottatokenja00jkro",
//       "harrypottersorce00rowl",
//       "harrypottersorc00rowl",
//       "harrypottersorce00rowl_0",
//       "harrypotterphilo0000rowl_t2o9",
//       "harrypotterphilo0000rowl_j1k7",
//       "harrypottersorce00jkro",
//       "isbn_9789984053851",
//       "harrypotterylapi00rowl",
//       "harrypotteraguso0000rowl",
//       "garripotterifilo00jkro",
//       "harrypotterphilo0000rowl_u9v4",
//       "harrypotterphilo0000rowl",
//       "harrypotterundde0000rowl",
//       "harriuspotteretp00jkro",
//       "harrypotterphilo00rowl_044",
//       "harriuspotteretp00rowl",
//       "bdrc-W1KG14543"
//     ],
//     "ia_collection_s": "ambslibrary-ol;americana;americanuniversity-ol;bannedbooks;barryuniversity-ol;belmont-ol;binghamton-ol;bpljordan-ol;brynmawr-ol;buddhist-digital-resource-center;buddhist-digital-resource-center-restricted;cnusd-ol;cua-ol;dartmouthlibrary-ol;delawarecountydistrictlibrary;delawarecountydistrictlibrary-ol;denverpubliclibrary-ol;drakeuniversity-ol;goffstownlibrary-ol;gwulibraries-ol;hamiltonpubliclibrary-ol;inlibrary;internetarchivebooks;ithacacollege-ol;johnshopkins-ol;marymount-ol;miltonpubliclibrary-ol;occidentalcollegelibrary-ol;openlibrary-d-ol;popularchinesebooks;printdisabled;randolph-macon-college-ol;rochester-ol;salisburyfreelibrary-ol;spokanepubliclibrary-ol;the-claremont-colleges-ol;tulsacc-ol;uhmauicollege-ol;unb-ol;uni-ol;universityofarizona-ol;universityofcoloradoboulder-ol;universityofthewest-ol;wilsoncollege-ol;worthingtonlibraries-ol",
//     "key": "/works/OL82563W",
//     "language": [
//       "tha",
//       "heb",
//       "afr",
//       "dan",
//       "mar",
//       "fre",
//       "tur",
//       "ice",
//       "ger",
//       "grc",
//       "urd",
//       "lav",
//       "ltz",
//       "gla",
//       "ita",
//       "chi",
//       "pol",
//       "dut",
//       "alb",
//       "spa",
//       "swe",
//       "eng",
//       "hin",
//       "gre",
//       "ara",
//       "cze",
//       "hun",
//       "ukr",
//       "por",
//       "cat",
//       "wel",
//       "rum",
//       "hrv",
//       "tib",
//       "bul",
//       "rus",
//       "per",
//       "lit",
//       "kor",
//       "kal",
//       "gle",
//       "lat",
//       "fin",
//       "ben",
//       "jpn",
//       "vie"
//     ],
//     "lending_edition_s": "OL38565767M",
//     "lending_identifier_s": "harrypotterylapi0000rowl_q5r6",
//     "public_scan_b": false,
//     "title": "Harry Potter and the Philosopher's Stone"
//   }]

export interface OpenLibraryBookSearchResponse {
  numFound: number;
  start: number;
  numFoundExact: boolean;
  docs: OpenLibraryBook[];
}

export interface OpenLibraryBook {
  key: string;
  title: string;
  author_name: string[];
  cover_i?: number;
  first_publish_year: number;
  author_key: string[];
  cover_edition_key: string;
  cover_url: string;
  edition_count: number;
  has_fulltext: boolean;
  ia?: string[];
  language?: string[];
  lending_edition_s?: string;
  lending_identifier_s?: string;
}

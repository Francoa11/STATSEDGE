export enum Screen {
  Landing = '/',
  ValueBetPro = '/app',
  Auth = '/auth',
  ProAnalyst = '/analyst',
  GoldPick = '/goldpick',
  Syndicate = '/syndicate',
  RiskManager = '/risk',
  About = '/about',
  Careers = '/careers',
  Contact = '/contact',
  Affiliates = '/affiliates',
  Terms = '/terms',
  Privacy = '/privacy',
  Responsible = '/responsible-gaming'
}

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
  isThinking?: boolean;
}

export interface NewsItem {
  title: string;
  source: string;
  url: string;
}

export interface GroundingChunk {
  web?: {
    uri: string;
    title: string;
  };
  maps?: {
    uri: string;
    title: string;
    placeAnswerSources?: {
      reviewSnippets?: {
        reviewText: string;
      }[];
    }[];
  };
}

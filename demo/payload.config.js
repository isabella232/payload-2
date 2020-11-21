const Admin = require('./collections/Admin');
const AllFields = require('./collections/AllFields');
const AutoLabel = require('./collections/AutoLabel');
const Code = require('./collections/Code');
const Conditions = require('./collections/Conditions');
const CustomComponents = require('./collections/CustomComponents');
const File = require('./collections/File');
const Blocks = require('./collections/Blocks');
const DefaultValues = require('./collections/DefaultValues');
const HiddenFields = require('./collections/HiddenFields');
const Hooks = require('./collections/Hooks');
const Localized = require('./collections/Localized');
const LocalizedArray = require('./collections/LocalizedArray');
const LocalOperations = require('./collections/LocalOperations');
const Media = require('./collections/Media');
const NestedArrays = require('./collections/NestedArrays');
const Preview = require('./collections/Preview');
const PublicUsers = require('./collections/PublicUsers');
const RelationshipA = require('./collections/RelationshipA');
const RelationshipB = require('./collections/RelationshipB');
const RichText = require('./collections/RichText');
const Select = require('./collections/Select');
const StrictPolicies = require('./collections/StrictPolicies');
const Validations = require('./collections/Validations');

const BlocksGlobal = require('./globals/BlocksGlobal');
const NavigationArray = require('./globals/NavigationArray');
const GlobalWithStrictAccess = require('./globals/GlobalWithStrictAccess');

module.exports = {
  admin: {
    user: 'admins',
    // indexHTML: 'custom-index.html',
    meta: {
      titleSuffix: '- Payload Demo',
      // ogImage: '/static/find-image-here.jpg',
      // favicon: '/img/whatever.png',
    },
    disable: false,
    components: {
      // Nav: () => (
      //   <div>Hello</div>
      // ),
    },
  },
  email: {
    transport: 'mock',
    fromName: 'Payload',
    fromAddress: 'hello@payloadcms.com',
  },
  collections: [
    Admin,
    AllFields,
    AutoLabel,
    Code,
    Conditions,
    CustomComponents,
    File,
    DefaultValues,
    Blocks,
    HiddenFields,
    Hooks,
    Localized,
    LocalizedArray,
    LocalOperations,
    Media,
    NestedArrays,
    Preview,
    PublicUsers,
    RelationshipA,
    RelationshipB,
    RichText,
    Select,
    StrictPolicies,
    Validations,
  ],
  globals: [
    NavigationArray,
    GlobalWithStrictAccess,
    BlocksGlobal,
  ],
  cookiePrefix: 'payload',
  serverURL: 'http://localhost:3000',
  cors: [
    'http://localhost',
    'http://localhost:3000',
    'http://localhost:8080',
    'http://localhost:8081',
  ],
  csrf: [
    'http://localhost:3000',
    'https://other-app-here.com',
  ],
  routes: {
    api: '/api',
    admin: '/admin',
    graphQL: '/graphql',
    graphQLPlayground: '/graphql-playground',
  },
  defaultDepth: 2,
  compression: {},
  paths: {
    scss: 'client/scss/overrides.scss',
  },
  graphQL: {
    maxComplexity: 1000,
    mutations: {}, // TODO: needs typing
    queries: {}, // TODO: needs typing
    disablePlaygroundInProduction: true,
  },
  rateLimit: {
    window: 15 * 60 * 100,
    max: 100,
    trustProxy: true,
    skip: (req) => req.ip === '127.0.0.1',
  },
  maxDepth: 10,
  localization: {
    locales: [
      'en',
      'es',
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  hooks: {
    afterError: (err) => {
      console.error('global error config handler', err);
    },
  },
  upload: {
    limits: {
      fileSize: 10000000, // 10MB
    },
  },
  webpack: (config) => config,
};

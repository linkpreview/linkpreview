import { generateDummyData } from 'utils';

const state = {
  activity: {
    message: '',
    activityCount: {count: 0},
    error: '',
    syncMessage: '',
    loading: false,
    featureIntro: {},
    syncError: '',
    activities:generateDummyData(3),
    myActivities: generateDummyData(3),
    activity: generateDummyData(1)[0]
  },
  app: {
    error: '',
    message: '',
    siteMode: 'app', //app, admin, page
    //for making message component removable. network error, app message
    showNetErrorComponent:false,
    //application announcements from the admin
    appMessage: '',
    showAnnouncementMessageComponent: false,
    redirectState: '',
    fullScreenMode: false,
    redirectedToAuthenticated: false,
    isPageChanged: false,
    isStatsLoading: false,
    isCodeLoading: false,
    featureIntro: {},
    searchItems: {itineraries: generateDummyData(3), places: [], comments: [], users:[]},
    newsFeedItems: generateDummyData(3),
    followings: 0,
    showAppModal: false,
    //where the client has finished loading the app. initially it is false
    //this is state is changed from componentDidMount of App.jsx container
    appLoaded: false,
    stat: {itinerariesCount:0,placesCount:0, commentsCount:0, travellersCount: 0,photosCount: 0, newsFeedCount: 0}
  },
  comment: {
    comments: [],
    commentCount: {count: 0},
    comment: {},
    recentComments:generateDummyData(5),
    updateMode: false,
    error: ''
  },
  featured: {
    message: '',
    error: '',
    syncMessage: '',
    featureIntro: {},
    syncError: '',
    features:generateDummyData(2),
    featured: generateDummyData(1)[0],
    homeFeatured: generateDummyData(1)[0],
    imgLoaded: false,
    imgRequest: false,
    mode: 'app'
  },
  follower: {
    followers: generateDummyData(2),
    following: generateDummyData(2),
    follower: {},
    followerCount: {count: 0},
    isFetching: false,
    isFollowed: false,
    isFollowedFetching: false,
    error: '',
    errorStatus: 200
  },
  notification: {
    notifications: generateDummyData[2],
    count: {count: 0},
    error: '',
    errorStatus: 200,
    isFetching: true,
    message: ''
  },
  itinerary: {
    message: '',
    error: '',
    syncMessage: '',
    featureIntro: {},
    syncError: '',
    loading: false,
    itineraries:generateDummyData(3),
    details:{details: generateDummyData(2)},
    searchingMode: false,
    myItineraries:generateDummyData(2),
    featuredItinerary:{},
    itinerary: generateDummyData(1)[0]
  },
  page: {
    message: '',
    error: '',
    syncMessage: '',
    featureIntro: {},
    loading: false,
    syncError: '',
    pages:generateDummyData(2),
    myPages: generateDummyData(2),
    page: generateDummyData(1)[0]
  },
  place: {
    message: '',
    error: '',
    syncMessage: '',
    featureIntro: {},
    loading: false,
    syncError: '',
    places:generateDummyData(3),
    myPlaces: generateDummyData(2),
    place: generateDummyData(1)[0],
    countries:{}
  },
  photo: {
    photos: generateDummyData(2),
    photoCount: {count: 0},
    newPhotos: [],
    uploadPercentage: 0,
    documentId: null,    
    photo: {},
    prev: null,
    next: null,
    error: '',
    message: '',
    syncMessage: '',
    syncError: ''
  },
  user: {
    authenticated: false,
    authenticating: false,
    isWaiting: false,
    isNewsFeeding: false,
    refreshingToken: false,
    verifyingToken: false,
    token: null,
    expired: false,
    message: '',
    error: '',
    syncMessage: '',
    syncError: '',
    isLogin: true,
    profile: generateDummyData(1)[0],
    users: [],
    feeds: generateDummyData(1),
    featureIntro: {},
  },
  visitor: {
    visitors: [],
    visitorCount: {count: 0},
    visitor: {},
    isFetching: false,
    isVisited: false,
    isVisitedFetching: false,
    error: '',
    errorStatus: 200
  },
  vote: {
    voters: generateDummyData(2),
    upVoteCount: 0,
    downVoteCount: 0,
    vote: {},
    isFetching: false,
    isVoted: false,
    isUpVoted: false,
    isDownVoted: false,
    isVotedFetching: false,
    error: '',
    errorStatus: 200
  },
  pending: {
    isPending: false,
    payload: null
  },
  post: {
    posts: generateDummyData(3),
    post: {},
    error: '',
    message: '',
    loading: false,
    isFetching: false
  }
};

export default state;

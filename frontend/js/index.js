
Vue.use(VueMaterial);

Vue.material.registerTheme({
  default: {
    primary: {
      color: 'light-green',
      hue: 700
    },
    accent: 'red'
  },
  teal: {
    primary: 'blue',
    accent: 'pink'
  },
  purple: {
    primary: 'purple',
    accent: 'orange'
  }
});




var App = new Vue({

	el: '#app',

  data:  () => ({

	  orderField:'id',
	  orderDirection:'desc',
	  
	  showPass		:	false,
	  
	  aPost			: {},
	  aComments		: {},
	  
	  postSTARTloading:	false,
	  
	  aPostID		: 0,

      count: '',
      next: '',
      previous: '',
      size: 10,
      page: 1,
      stocks: [],
      page_options: [10, 25, 50, 100],


	  user_avatar		: '',
	  user_avatar_file	: '',

	  post_image: '',
	  post_media_sel: false,
	  
	  post_media_changed: false,
	  post_image_changed: false,

	  post_image_file:'',
	  post_media_file:'',
	  
	  prev_post_mediatype:'',
	  
	  prev_overlay_type:'',	  
	  
	  
		showLOADINGspinner:false,
		showLOADINGerror:false,
		showPostLOADINGerror:false,
    
		loginServerError 	:	false,



	  overlay_image: 		'',
	  overlay_image_file	: '',
	  
	  overlay_image_sel		: false,
	  overlay_media_android_sel		: false,
	  overlay_media_android_file	: '',
	  
	  overlay_media_ios_sel		: false,
	  overlay_media_ios_file	: '',
	  
	  overlay_media_android_changed	: false,
	  overlay_media_ios_changed		: false,
	  overlay_preview_image_changed	: false,
	  
	  
		showLOADINGspinnerOverlay:false,
		showLOADINGerrorOverlay:false,


     route: '/',

	 enableChangeEvent	: false,

	 authId			:	null,

	 user			:	null,

	 USERavatar		:	'',
	 username		:	'',


	 a_data			:	[],

	 users_list		: null,
	 posts_list		: null,
	 feeds_list		: null,
	 comments_list	: [],
	 overlays_list	: null,
	 polls_list		: null,
	 
	 users_loaded	: false,
	 posts_loaded	: false,
	 feeds_loaded	: false,
	 comments_loaded: false,
	 overlays_loaded: false,
	 polls_loaded	: false,
	 
	 
	 posts_by_feed	: [],

	 posts_by_user	: {},
	 comments_by_post: [],
	 comments_by_id	: null,
	 feeds_by_id	: null,
	 users_by_id		: null,


	 postsAStable		: true,

	 idEDITpost			: 0,
	 idEDITfeed			: 0,
	 idEDITuser			: 0,
	 idEDITcomment		: 0,
	 idEDIToverlay		: 0,
	 idEDITpoll			: 0,

	 attemptSubmitPOST	:	false,
	 post_title			:	'',
	 post_subtitle		:	'',
	 post_description	:	'',
	 post_mediatype		:	'text',
	 post_media_uuid	:	'',

	 postId				:	0,
	 userId				:	0,
	 thrPost			:	null,

	 post_feed			:	'',

	 feed_name			: 	'',

	 prev_login			:	'',
	 prev_email			:	'',

    logInForm: true,

    login_login	: '',
    login_email	: '',
    login_pwd	: '',
    attemptSubmitLogin	: false,
    emailLoginNotFound	: false,
    wrongLoginEmail		: false,
	emptyPwd			: false,
    wrongPwd			: false,

    signup_login	: '',
    signup_pwd		: '',
    signup_email	: '',
    attemptSubmitSignup		: false,
	emptyLoginSignup		: false,
    loginAlreadyExists		: false,
    emptyEmailSignup		: false,
    emailSignupAlreadyExists: false,
	emptyPwdSignup			: false,
	wrongSignupEmail		: false,

      index: 0,

	  createNEWpost			:	false,
	  createNEWfeed			:	false,
	  createNEWcomment		:	false,
	  createNEWoverlay		:	false,
	  createNEWpoll			:	false,
	  createNEWuser			:	false,

	  poll_name			: '',
	  poll_active		: false,
	  attemptSubmitPOLL	:	false,

	  comment_text		: '',
	  comment_post_id	: '',
	  attemptSubmitCOMMENT	:	false,

	  overlay_name		: '',
	  overlay_type		: '',
	  
	  overlay_media_uuid: '',
	  overlay_image_uuid: '',

	  attemptSubmitOverlay	:	false,

      post_feed_id_filter   : '',


    alert: {
      content: 'Your post has been PUBLISHED',
      ok: 'ok'
  }})

  ,


  router,
  template: '#root-template'
,




  store: store,

  computed: theComputed,

  methods: theMethods,


  mounted () {
    this.enableChangeEvent = true;

	//this.a_data = this.$store.state.a_data;
	/*
	if(this.a_data['users'])
		this.users_list = this.a_data['users'];

	if(this.a_data['posts'])
		this.posts_list = this.a_data['posts'];

	if(this.a_data['feeds'])
		this.feeds_list = this.a_data['feeds'];

	if(this.a_data['comments'])
		this.comments_list = this.a_data['comments'];
	*/

	this.user = this.$store.state.usr;
	this.USERavatar = '/no-avatar.gif';

	/*
	console.log('this.user')
	console.log(this.user)
	*/

	if(this.user)
		this.authId = this.user.id;

	/*
	if(this.$store.state.postsAStable)
		this.postsAStable = this.$store.state.postsAStable;
	*/

	if(this.authId)
	{
		this.USERavatar = S3server+'avatars/'+this.authId+'?'+Math.random();
		this.username = this.user.nickname;
	}
	
	
	
		if(this.authId)
		{
				//preload fresh data
		
				this.loadData('posts');
		//		this.loadData('comments');
				this.loadData('feeds');
				this.loadData('polls');
		//		this.loadData('overlays');
				this.loadData('users');
		}
	
  }
})

;


Vue.http.headers.common['Access-Control-Allow-Origin'] = true;
Vue.http.headers.common['Access-Control-Allow-Origin'] = '*';
Vue.http.options.credentials = true;
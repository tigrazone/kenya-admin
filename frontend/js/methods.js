var theMethods =
{
	do_get_post()
	{
					var d=document.getElementById('post_id_prepare');
					this.getPost(d.value);
					this.postSTARTloading=true;
	},
	
	getPost(postID)
	{
		//console.log('getPost('+postID+')');
		
		this.aPost = {};
		this.aComments = {};
		
		this.aPostID = postID;
		
		
		 this.$http.get(BASEserver+'/articles/'+postID
		 ,
							  {credentials:true}
		 )
		  .then(
			  response => {
				  //200
				console.log(response);

						if(response.body)
						{
							this.aPost = response.body;
							
							
							this.postSTARTloading=false;
								var d=document.getElementById('post_id_prepare');
								d.value=0;

								var date = new Date(this.aPost.datetime);

								var options = {
									year: 'numeric',
									month: 'numeric',
									day: 'numeric',
									hour: 'numeric',
									minute: 'numeric',
									timezone: 'UTC'
								};

								//var tx=date.toLocaleString("ru", options);
								var tx=date.toLocaleString("en-US", options);

								this.aPost.dateTimeSTR = tx;
							
								
								
										var u = this.aPost.author;
										this.aPost.userNAME='';

										if(u.nickname)
											this.aPost.userNAME +=u.nickname+" ";

										if(u.email)
											this.aPost.userNAME +=u.email;
								
							

								var ml = '';
								if(this.aPost.mediatype=='image')
									ml = S3server+'media/'+ this.aPost.medialinkUuid;
								if(this.aPost.mediatype=='video')
									ml = S3server+'media/'+ this.aPost.medialinkUuid;

								this.aPost.medialink = ml
							
							
							this.aComments = response.body.comments;
							for(idx in this.aComments)
							{
								var comm = this.aComments[idx];

																	var date = new Date(comm.datetime);

																	var options = {
																		year: 'numeric',
																		month: 'numeric',
																		day: 'numeric',
																		hour: 'numeric',
																		minute: 'numeric',
																		timezone: 'UTC'
																	};

																	//var tx=date.toLocaleString("ru", options);
																	var tx=date.toLocaleString("en-US", options);
																	
																	

																var postName = '';
																if(this.aPost.title)
																	postName=this.aPost.title;
																if(this.aPost.subtitle)
																{
																	if(postName!='') postName+=' ';
																	postName+=this.aPost.subtitle;
																}
																
																
																	var userName = '';
																	if(comm.user.nickname)
																		userName=comm.user.nickname;
																	if(comm.user.email)
																	{
																		if(userName!='') userName+=' ';
																		userName+=comm.user.email;
																	}
																	
								this.aComments[idx].dateTimeSTR = tx;
								this.aComments[idx].postName = postName;
								this.aComments[idx].userName = userName;
							}
						}
			  }
			  , response => {
				// error callback

				console.log('error callback');
				console.log(response);
			  });
	},
	
	doReloadPage()
	{
		document.location.reload(true);
	},

	image_upload()
	{
		document.getElementById('postFileInput').click();
	},

	media_upload()
	{
		document.getElementById('postFileInputMedia').click();
	},

	user_avatar_upload()
	{
		document.getElementById('postFileUserAvatar').click();
	},

	overlay_image_upload()
	{
		document.getElementById('postFileOverlayImage').click();
	},

	overlay_media_android_upload()
	{
		document.getElementById('postFileInputOverlayMedia_android_').click();
	},

	overlay_media_ios_upload()
	{
		document.getElementById('postFileInputOverlayMedia_ios_').click();
	},

    onFileChangeOverlayMediaAndroid: function onFileChangeOverlayMediaAndroid(e) {
      var files = e.target.files || e.dataTransfer.files

	  console.log('onFileChangeOverlayMedia android files')
	  console.log(files)

      if (!files.length) return;

	  this.overlay_media_android_file = files[0];
	  this.overlay_media_android_sel = true;
	  this.overlay_media_android_changed = true;
    },

    onFileChangeOverlayMediaIos: function onFileChangeOverlayMediaIos(e) {
      var files = e.target.files || e.dataTransfer.files

	  console.log('onFileChangeOverlayMedia ios files')
	  console.log(files)

      if (!files.length) return;

	  this.overlay_media_ios_file = files[0];
	  this.overlay_media_ios_sel = true;
	  this.overlay_media_ios_changed = true;
    },



    onFileChangeOverlayImage: function onFileChangeOverlayImage(e) {
      var files = e.target.files || e.dataTransfer.files;

	  console.log('onFileChangeOverlayImage files')
	  console.log(files)
      if (!files.length) return;
      this.createOverlayImage(files[0]);
    },

    createOverlayImage: function createOverlayImage(file) {
	 this.overlay_image_file = file;

      var image = new Image();
      var reader = new FileReader();
      var vm = this;

      reader.onload = function (e) {
        vm.overlay_image = e.target.result;
		vm.overlay_preview_image_changed = true;
      };
      reader.readAsDataURL(file);
    },

    removeOverlayImage: function removeImage(e) {
      this.overlay_image = '';
      this.overlay_preview_image_changed = false;
    },

    onFileChangeUserAvatar: function onFileChangeUserAvatar(e) {
      var files = e.target.files || e.dataTransfer.files;

	  console.log('onFileChangeUserAvatar files')
	  console.log(files)
      if (!files.length) return;
      this.createUserAvatar(files[0]);
    },

    createUserAvatar: function createUserAvatar(file) {
	 this.user_avatar_file = file;

      var image = new Image();
      var reader = new FileReader();
      var vm = this;

      reader.onload = function (e) {
        vm.user_avatar = e.target.result;
      };
      reader.readAsDataURL(file);
    },

    removeUserAvatar: function removeUserAvatar(e) {
      this.user_avatar = '';
    },



    onFileChangeMedia: function onFileChangeMedia(e) {
      var files = e.target.files || e.dataTransfer.files

	  console.log('onFileChangeMedia files')
	  console.log(files)

      if (!files.length) return;

	  this.post_media_file = files[0];
	  this.post_media_sel = true;
	  this.post_media_changed = true;
    },

    onFileChangeImage: function onFileChangeImage(e) {
      var files = e.target.files || e.dataTransfer.files;
      if (!files.length) return;
      this.createImage(files[0]);
    },

    createImage: function createImage(file) {
	 this.post_image_file = file;

      var image = new Image();
      var reader = new FileReader();
      var vm = this;

      reader.onload = function (e) {
        vm.post_image = e.target.result;
		vm.post_image_changed = true;
      };
      reader.readAsDataURL(file);
    },

    removeImage: function removeImage(e) {
      this.post_image = '';
	  
	  this.post_image_changed = false;
    },

    cleanMEDIA: function cleanMEDIA(e) {
		this.post_media_sel=false;
		this.post_media_changed=false;
		
								this.showLOADINGspinner = false;
								this.showLOADINGerror = false;
								this.showPostLOADINGerror = false;
								this.loginServerError = false;
    },

    cleanMEDIA_overlay_android: function cleanMEDIA(e) {
		this.overlay_media_android_sel=false;
		this.overlay_media_android_changed=false;
		
								this.showLOADINGspinnerOverlay = false;
								this.showLOADINGerrorOverlay = false;
    },

    cleanMEDIA_overlay_ios: function cleanMEDIA(e) {
		this.overlay_media_ios_sel=false;
		this.overlay_media_ios_changed=false;
		
								this.showLOADINGspinnerOverlay = false;
								this.showLOADINGerrorOverlay = false;
    },




    reOrder(object) {
      this.orderField = object.name;
      this.orderDirection = object.type;
    },

    reOrder0(object) {
      this.orderField = 'feedId';
      this.orderDirection = 'asc';
    },

      onPagination (e) {
          this.size = e.size;
          this.page = e.page
          //this.fetchData()
      },

        isPath (path) {
		/*
           console.log('isPath('+path+')');
           console.log('this.$route.path='+this.$route.path);
           console.log('this.$route.path===path  '+(this.$route.path === path));
		  */
           return this.$route.path === path
        },
		
		POLLcheckboxActiveToggle()
		{
			this.poll_active = !this.poll_active;
		},


		loadData(q)
		{
			console.log('*** loadData('+q+')')

			var q0 = q;

			if(q=="posts")
				q="articles"
			/*
			if(q0=="posts")
				this.posts_list=null;
			else
				if(q0=="users")
					this.users_list=null;
				*/

			this.$http.get(
		 BASEserver
		 +'/'+q
		 ,{credentials:true}
			)
		  .then(
			  response => {
				  /*
				  console.log('527')
				  console.log(response)

				  console.log('this.a_data');
				  console.log(this.a_data);
				  */
				  if(this.a_data) ; else
				  this.a_data = new Array();

				 if(this.a_data[q0]) ; else
					this.a_data[q0] = new Array();

				  this.a_data[q0] = response.body;

					store.commit('save_a_data', this.a_data);



			if(q0=="posts" || q0=="comments")
			{
				this.posts_list=response.body;
				this.posts_loaded = true;

				if(this.feeds_list)
					this.loadData('feeds')

				this.posts_by_user={};

				/*
				console.log('this.feeds_by_id')
				console.log(this.feeds_by_id)
				*/
				
				this.posts_by_feed = [];

						for(i in this.posts_list)
						{
							this.thePost = this.posts_list[i]
							this.userId = this.thePost.userId;
							this.postId = this.thePost.id;
							if(this.posts_by_user[this.userId]) ;
								else this.posts_by_user[this.userId]=0;

								this.posts_by_user[this.userId]++;


								var date = new Date(this.thePost.datetime);

								var options = {
									year: 'numeric',
									month: 'numeric',
									day: 'numeric',
									hour: 'numeric',
									minute: 'numeric',
									timezone: 'UTC'
								};

								//var tx=date.toLocaleString("ru", options);
								var tx=date.toLocaleString("en-US", options);

								this.posts_list[i].dateTimeSTR = tx;

								var ml = '';
								if(this.thePost.mediatype=='image')
									ml = S3server+'media/'+ this.thePost.medialinkUuid;
								if(this.thePost.mediatype=='video')
									ml = S3server+'media/'+ this.thePost.medialinkUuid;

								this.posts_list[i].medialink = ml
								this.posts_list[i].postLINK = '#/post/'+this.postId;

								if(this.feeds_by_id)
								{
									if(this.feeds_by_id[this.thePost.feedId])
										this.posts_list[i].feedNAME = this.feeds_by_id[this.thePost.feedId].name
								}



																var postName = '';
																if(this.thePost.title)
																	postName=this.thePost.title;
																if(this.thePost.subtitle)
																{
																	if(postName!='') postName+=' ';
																	postName+=this.thePost.subtitle;
																}



																	var date = new Date(this.thePost.datetime);

																	var options = {
																		year: 'numeric',
																		month: 'numeric',
																		day: 'numeric',
																		hour: 'numeric',
																		minute: 'numeric',
																		timezone: 'UTC'
																	};

																	//var tx=date.toLocaleString("ru", options);
																	var tx=date.toLocaleString("en-US", options);

								this.posts_list[i].bigname = postName + ' ' + tx;

								this.posts_list[i].comments=0;
								
								
								//заполнить posts_by_feed
								if(this.posts_by_feed[this.thePost.feedId]) ;
								else
								{
									this.posts_by_feed[this.thePost.feedId]=[];
								}
								
								this.posts_by_feed[this.thePost.feedId].push(
												this.posts_list[i]
								);

								//off get comment
								//if(0)
								{
								console.log('GET '+BASEserver+'/comments/'+this.postId);

								this.$http.get(BASEserver+'/comments/'+this.postId
											  ,
																	  {credentials:true}
											  )
											  .then(
												  response => {
													  //200

													  /*
														console.log('* GET comments/'+postId);
														console.log(response);
														*/

															if(response.body)
															{
																var comments = response.body;
																var n=0;

																var postName = '';
																if(this.thePost.title)
																	postName=this.thePost.title;
																if(this.thePost.subtitle)
																{
																	if(postName!='') postName+=' ';
																	postName+=this.thePost.subtitle;
																}


																	var date = new Date(this.thePost.datetime);

																	var options = {
																		year: 'numeric',
																		month: 'numeric',
																		day: 'numeric',
																		hour: 'numeric',
																		minute: 'numeric',
																		timezone: 'UTC'
																	};

																	//var tx=date.toLocaleString("ru", options);
																	var tx=date.toLocaleString("en-US", options);


																for(c in comments)
																{
																	var comm = comments[c];

																/*
																	console.log('comm.user')
																	console.log(comm.user)
																	*/

																	var userName = '';
																	if(comm.user.nickname)
																		userName=comm.user.nickname;
																	if(comm.user.email)
																	{
																		if(userName!='') userName+=' ';
																		userName+=comm.user.email;
																	}


																	var date = new Date(comm.datetime);

																	var options = {
																		year: 'numeric',
																		month: 'numeric',
																		day: 'numeric',
																		hour: 'numeric',
																		minute: 'numeric',
																		timezone: 'UTC'
																	};

																	//var tx=date.toLocaleString("ru", options);
																	var tx=date.toLocaleString("en-US", options);


																	this.comments_list.push(
																	{
																		id: comm.id,
																		datetime: comm.datetime,
																		text: comm.text,
																		user: comm.user,
																		articleId: this.postId,
																		postName: postName+' '+tx,
																		userName: userName,
																		dateTimeSTR: tx,
																	})
																		;
																	n++;
																	this.comments_loaded = true;
																}

																this.comments_by_post[this.postId] = n;
															}
												  }
												  , response => {
													// error callback

													  console.log('* GET comments/'+this.postId);
													console.log('error callback');
													console.log(response);

													if(response.status==404)
													{
													}
												  }
												  );
								}


								if(this.users_by_id)
								{
									if(this.users_by_id[this.thePost.userId])
									{
										var u = this.users_by_id[this.thePost.userId];
										this.posts_list[i].userNAME='';

										if(u.nickname)
											this.posts_list[i].userNAME +=u.nickname+" ";

										if(u.email)
											this.posts_list[i].userNAME +=u.email;
									}
								}
						}



						//calc comments by post


				/*
			console.log('512 posts_list');
			console.log(this.posts_list);
			*/
			/*
				console.log('1033 posts_by_feed');			
				console.log(this.posts_by_feed);
				*/
			}
			else
				if(q0=="polls")
				{
					this.polls_list=response.body;
					this.polls_loaded = true;
				}
			else
				if(q0=="users")
				{
					this.users_list=response.body;
					this.users_loaded = true;
					/*
			console.log('519 users_list');
			console.log(this.users_list);
			*/

					this.users_by_id = {};

						for(i in this.users_list)
						{
							var u = this.users_list[i]
							
							if(u.id==this.authId)
								this.username = u.nickname
							
							var n=0;
							if(this.posts_by_user[u.id])
								n=this.posts_by_user[u.id];
							this.users_list[i].posts = n;

							this.users_by_id[u.id] = {
										nickname 	: u.nickname,
										email 		: u.email
							}
						}


				}
			else
				if(q0=="feeds")
				{
					this.feeds_list=response.body;
					this.feeds_loaded = true;
					/*
			console.log('519 users_list');
			console.log(this.users_list);
			*/

					this.feeds_by_id={};

					for(i in this.feeds_list)
					{
						var f = this.feeds_list[i]
						this.feeds_by_id[f.id] = {name: f.name};
					}

					/*
					console.log('581 feeds_by_id')
					console.log(this.feeds_by_id)
					*/

				}
			else
				if(q0=="overlays")
				{
					this.overlays_list=response.body;
					this.overlays_loaded = true;

					for(o in this.overlays_list)
					{
						this.overlays_list[o].previewUuidSRC = S3server+'preview/'+this.overlays_list[o].previewUuid;
                        this.overlays_list[o].media_android_link = S3server+'androidFile/'+this.overlays_list[o].androidFileUuid;
                        this.overlays_list[o].media_ios_link = S3server+'iosFile/'+this.overlays_list[o].iosFileUuid;
					}

				}
			else
				if(q0=="comments")
				{
					this.comments_list=response.body;
					this.comments_loaded = true;
					/*
			console.log('768 comments_list');
			console.log(this.comments_list);
			*/


				this.comments_by_post=[];
				this.comments_by_id=[];

						for(i in this.comments_list)
						{
							var comm = this.comments_list[i]

							this.comments_by_id[c.id] = {
																		id: comm.id,
																		datetime: comm.datetime,
																		text: comm.text,
																		userId: comm.userId,
																		articleId: comm.articleId,
																	}
														;

							this.postId = comm.postId;

							this.comments_by_post[this.postId].push(
								{
																		id: comm.id,
																		datetime: comm.datetime,
																		text: comm.text,
																		userId: comm.userId,
																		articleId: comm.articleId,
																	}
							);
						}

				}

				  /*
				  console.log('Q='+q);
				  console.log(response.body);
				  */




					console.log('*** loadData('+q+') loaded')

			  }, response => {
								// error callback

										console.log('error callback');
										console.log(response);

										console.log('response.status='+response.status)

										if(response.status==401)
										{
											console.log('401 LOGOUT')
											this.doLogout();
										}

					console.log('*** loadData('+q+') NOT loaded')
								});

		},

	doAuth(eml,pwd, isLoginPage)
	{

							  this.$http.post(BASEserver+'/users/authorization',
							  {
								"email": eml,
								"password": pwd
							  },
							  {credentials:true}
							  ).then(response => {

									console.log(response);



									if(response.body)
									{
										if(response.body.id)
										{

											this.doLogin(response.body.id, response.body);

										}
									}


							  }, response => {
								// error callback

										console.log('error callback');
										console.log(response);

										if(isLoginPage)
										{
											this.wrongPwd = true;
											this.attemptSubmitLogin = false;

											this.attemptSubmitLogin = true;
										}
								});
	},

	doLogout()
	{
		console.log('doLogout');
		this.log = false;
		this.authId = null;
		this.user = null;
		this.showPass = false;

		this.clearUpLogForms();

		store.commit("LOGOUT");

	},

	editMyProfile()
	{
		//router.push('/user')
		
		console.log('EDITuser('+this.authId+')');
		this.EDITuser(this.authId);

	},

	doLogoutNOW()
	{
		this.doLogout();

			router.push('/login')

	},

	doLogin(uid, usr)
	{
		//console.log('doLogin');
		this.log = false;
		this.authId = uid;
		this.user = usr;
		
		this.username = usr.nickname
		this.USERavatar = S3server+'avatars/'+this.authId+'?'+Math.random();

		this.clearUpLogForms();

		store.commit('LOGIN', usr);
		

				//preload fresh data
				
				this.loadData('posts');
		//		this.loadData('comments');
				this.loadData('feeds');
				this.loadData('polls');
		//		this.loadData('overlays');
				this.loadData('users');

	},


    onChange(tabIndex) {
      //console.log('onChange is triggered');
      if(this.enableChangeEvent){
        //console.log('onChange is enabled');


      this.index = tabIndex;

      if (!this.$refs.tabs) return;
      var tabs = this.$refs.tabs;
      if (!tabs.activeTab) return;
      if (!tabs.tabList.hasOwnProperty(tabs.activeTab)) return;
      var activeTab = tabs.tabList[tabs.activeTab].ref;
      if (!activeTab) return;

	  //console.log(activeTab.id)

		if(
			activeTab.id=="users"
			||
			activeTab.id=="posts"
			||
			activeTab.id=="comments"
			||
			activeTab.id=="feeds"
			||
			activeTab.id=="polls"
			||
			activeTab.id=="overlays"
		)
		{
			
			//при переключении вкладки очищать формы
			
			this.clearUpLogForms();
			this.clearFEEDForm();
			this.clearPOSTForm();
			this.clearCommentForm();
			this.clearOverlayForm();
			this.clearPOLLForm();
			

			var q = activeTab.id;
			var q0=q
			console.log("Q="+q)

			router.push('/'+activeTab.id)

			if(activeTab.id=="users")
			{

				if(!this.posts_list)
					this.loadData('posts');

				this.loadData(q);

			}
			else
			if(activeTab.id=="comments")
			{

				if(!this.posts_list)
					this.loadData('posts');

				//this.loadData(q);

			}
			else
			if(activeTab.id=="overlays")
			{

				this.loadData(q);

			}
			else
			if(activeTab.id=="polls")
			{

				this.loadData(q);

			}
			else
			if(activeTab.id=="posts")
			{

				if(!this.posts_list)
					this.loadData('feeds');

				this.loadData(q);

			}
			else
				this.loadData(q);

		}
		else
		if(activeTab.id=="logout")
		{
			this.doLogout();

			router.push('/')
		}
		else
		router.push('/'+activeTab.id)

      }
    },

	

	clearUpLogForms()
	{
		console.log('clearUpLogForms')
		//теперь только логин, очистить переменные форм
		this.logInForm = true;
		this.logIn_email = '';
		this.logIn_pwd = '';

		this.signup_login = '';
		this.signup_email = '';
		this.signup_pwd = '';

		this.prev_login		= '';
		this.prev_email		= '';
		
		this.createNEWuser = false;
		this.idEDITuser = 0;

		router.push(BASEaddr);
	},
	
    clearSignupForm: function () {
								this.submit_login		='';
								this.submit_email		='';
								this.submit_pwd			='';

								  this.attemptSubmitSignup = false;
								  this.loginSignupAlreadyExists = false;
								  this.emailSignupAlreadyExists = false;
								  this.wrongEmailSignup = false;

								this.createNEWuser		=false;
								this.idEDITuser			=0;
								
															
								if(this.authId)
								{
									this.USERavatar = S3server+'avatars/'+this.authId+'?'+Math.random();
									this.username = this.user.nickname;
								}
								
								
							},

    clearPOSTForm: function () {
								this.attemptSubmitPOST = false;

								this.post_title			='';
								this.post_subtitle		='';
								this.post_description	='';
								this.post_mediatype		='';
								this.post_media_uuid	='';
								this.post_feed			='';
								this.post_image			='';

								this.attemptSubmitPOST	=false;
								this.createNEWpost		=false;
								
								this.post_media_sel		=false;
								this.post_media_changed	=false;
								
								this.post_image_changed	=false;
								
								this.idEDITpost			=0;
								
								this.prev_post_mediatype='';
								
								this.showLOADINGspinner = false;
								this.showLOADINGerror = false;
								this.showPostLOADINGerror = false;
								this.loginServerError = false;
								
								this.postSTARTloading=false;
								var d=document.getElementById('post_id_prepare');
								d.value=0;
							},

    clearFEEDForm: function () {
								this.idEDITfeed			=0;
								this.createNEWfeed		=false;

								this.feed_name			='';
							},

    clearPOLLForm: function () {
								this.attemptSubmitPOLL  =false;
								
								this.idEDITpoll			=0;
								this.createNEWpoll		=false;

								this.poll_name			='';
								this.poll_active		=false;
							},

    clearCommentForm: function () {
								this.attemptSubmitCOMMENT 	=false;
								this.idEDITcomment			=0;
								this.createNEWcomment		=false;

								this.comment_text		='';
								this.comment_post_id	='';
							},

    clearOverlayForm: function () {
								this.attemptSubmitOverlay = false;
								this.idEDIToverlay		=0;
								this.createNEWoverlay	=false;

								this.overlay_name		='';
								this.prev_overlay_type	='';
								
								this.overlay_image		='';
								this.overlay_image_changed=false;
								this.overlay_image_file	='';
								
								this.overlay_media_android_file	='';
								this.overlay_media_android_changed=false;
								this.overlay_media_android_sel	=false;
								
								this.overlay_media_ios_file	='';
								this.overlay_media_ios_changed=false;
								this.overlay_media_ios_sel	=false;

								this.overlay_preview_uuid		='';
								this.overlay_media_android_uuid	='';
								this.overlay_media_ios_uuid		='';								
				
								this.showLOADINGspinnerOverlay = false;
								this.showLOADINGerrorOverlay = false;
							},



    set_postsAStable: function (val) {
								this.postsAStable=val;

								store.commit('save_postsAStable', val);
							},


    EDITuser: function (user_id) {
		this.clearSignupForm();

		var fnd=false;
		
		console.log('EDITuser('+user_id+')');
		console.log('this.users_list');
		console.log(this.users_list);
		
		var i0 = 0;

		for(i in this.users_list)
		{
			var u = this.users_list[i];

			if(u.id==user_id)
			{
				fnd=true;
				i0 = i;
				/*
				el = this.users_list[i];
				console.log('fnd! EL=')
				console.log(el)
				*/
				break;
			}
		}
		
		console.log('fnd='+fnd)
		console.log('i0='+i0)
		

		if(fnd)
		{
			/*
			var el = this.users_list[i0]
			
			
		console.log('EL=')
		console.log(el)
			*/
			
			console.log('this.users_list[i0]');		
			console.log(this.users_list[i0]);		
		
			
			this.signup_login	= this.users_list[i0].nickname;
			this.signup_email	= this.users_list[i0].email;
			//this.signup_pwd = '';

			this.prev_login		= this.signup_login;
			this.prev_email		= this.signup_email;
			
			this.idEDITuser	= user_id;
			this.createNEWuser = false;
			
			router.push('/user');
		}
	},


    EDITpoll: function (poll_id) {
		this.clearPOLLForm();

		var fnd=false;
		var el=null;

		for(i in this.polls_list)
		{
			var poll = this.polls_list[i];

			if(poll.id==poll_id)
			{
				fnd=true;
				el = poll;
				break;
			}
		}

		if(fnd)
		{
			this.idEDITpoll	= poll_id;

			this.poll_name	= el.name;
			this.poll_active= el.isActive;
		}
	},


    EDITfeed: function (feed_id) {
		this.clearFEEDForm();

		var fnd=false;
		var el=null;

		for(i in this.feeds_list)
		{
			var feed = this.feeds_list[i];

			if(feed.id==feed_id)
			{
				fnd=true;
				el = feed;
				break;
			}
		}

		if(fnd)
		{
			this.idEDITfeed	= feed_id;

			this.feed_name	= el.name;
		}
	},


    KILLfeed: function (feed_id) {
		this.clearFEEDForm();

		/*
		var fnd=false;
		var el=null;

		for(i in this.feeds_list)
		{
			var feed = this.feeds_list[i];

			if(feed.id==feed_id)
			{
				fnd=true;
				el = feed;
				break;
			}
		}

		if(fnd)
		{
			this.idEDITfeed	= feed_id;

								this.feed_name			=el.name;
		}
		*/
		alert("KILLfeed  not implemented yet")
	},


    EDIToverlay: function (overlay_id) {
		this.clearOverlayForm();

		var fnd=false;
		var el=null;

		for(i in this.overlays_list)
		{
			var overlay = this.overlays_list[i];

			if(overlay.id==overlay_id)
			{
				fnd=true;
				el = overlay;
				break;
			}
		}

		if(fnd)
		{
			this.idEDIToverlay	= overlay_id;

								this.overlay_name				=el.name;
								this.overlay_type				=el.type;
								this.prev_overlay_type			=el.type;
								
								this.overlay_media_android_uuid	=el.androidFileUuid;
								this.overlay_media_ios_uuid		=el.iosFileUuid;
								this.overlay_preview_uuid		=el.prewiewUuid;
								
								this.overlay_image_changed=false;
								this.overlay_media_android_changed=false;
								this.overlay_media_ios_changed=false;
								
								//если выбран и есть, то установить флаг
								if(el.androidFileUuid!='')
									this.overlay_media_android_sel = true;
								
								//если выбран и есть, то установить флаг
								if(el.iosFileUuid!='')
									this.overlay_media_ios_sel = true;
		}
	},


    EDITpost: function (post_id) {
		this.clearPOSTForm();

		var fnd=false;
		var el=null;

		for(i in this.posts_list)
		{
			var post = this.posts_list[i];

			if(post.id==post_id)
			{
				fnd=true;
				el = post;
				break;
			}
		}

		if(fnd)
		{
			this.idEDITpost	= post_id;

								this.post_title			=el.title;
								this.post_subtitle		=el.subtitle;
								this.post_description	=el.description;
								this.post_mediatype		=el.mediatype;
								this.post_media_uuid	=el.medialinkUuid;
								this.post_feed			=el.feedId;
								
								this.prev_post_mediatype=el.mediatype;
								
								//если выбран image и оно есть, то установить флаг
								if(el.mediatype=='image' && el.medialinkUuid!='')
									this.post_image_sel = true;
								
								//если выбрано видео и оно есть, то установить флаг
								if(el.mediatype=='video' && el.medialinkUuid!='')
									this.post_media_sel = true;
		}
	},


    KILLpost: function (post_id) {
		this.clearPOSTForm();
		/*
		var fnd=false;
		var el=null;

		for(i in this.posts_list)
		{
			var post = this.posts_list[i];

			if(post.id==post_id)
			{
				fnd=true;
				el = post;
				break;
			}
		}

		if(fnd)
		{
			this.idEDITpost	= post_id;

								this.post_title			=el.title;
								this.post_subtitle		=el.subtitle;
								this.post_description	=el.description;
								this.post_mediatype		=el.mediatype;
								this.post_media_uuid	=el.medialinkUuid;
								this.post_feed			=el.feedId;
		}
		*/
		alert("KILLpost  not implemented yet")
	},




    EDITcomment: function (comment_id) {
		this.clearCommentForm();

		var fnd=false;
		var el=null;

		for(i in this.comments_list)
		{
			var comment = this.comments_list[i];

			if(comment.id==comment_id)
			{
				fnd=true;
				el = comment;
				break;
			}
		}

		if(fnd)
		{
			this.idEDITcomment	= comment_id;

								this.comment_text		=el.text;
								this.comment_post_id	=el.articleId;
		}
	},

    KILLcomment: function (comment_id) {
		this.clearCommentForm();
		/*
		var fnd=false;
		var el=null;

		for(i in this.comments_list)
		{
			var comment = this.comments_list[i];

			if(comment.id==comment_id)
			{
				fnd=true;
				el = comment;
				break;
			}
		}

		if(fnd)
		{
			this.idEDITcomment	= comment_id;

								this.comment_text		=el.text;
		}
		*/
		alert("KILLcomment  not implemented yet")
	},


	doPOST()
	{
		var dat =
				{
				title		:	this.post_title,
				subtitle	:	this.post_subtitle,
				description	:	this.post_description,
				mediatype	:	this.post_mediatype,
				feedId		:	this.post_feed
			};

		if(this.post_mediatype!='text')
			dat.medialink=this.post_media_uuid;

		 this.$http.post(BASEserver+'/articles',
			dat
		 )
		  .then(
			  response => {
				  //200
				console.log(response);

						if(response.body)
						{
							if(response.statusText=="OK")
							{
								this.$refs['published_DLG'].open();

								this.clearPOSTForm();

								//reload posts
								this.loadData('posts')
							}
						}
			  }
			  , response => {
				// error callback

				console.log('error callback');
				console.log(response);
				
				this.showPostLOADINGerror = true;

				if(response.status==404)
				{
				}
			  });
	},


	doPOSTupdate()
	{
		var dat =
				{
				title		:	this.post_title,
				subtitle	:	this.post_subtitle,
				description	:	this.post_description,
				mediatype	:	this.post_mediatype,
				feedId		:	this.post_feed
			};


		if(this.post_mediatype!='text')
			dat.medialinkUuid=this.post_media_uuid;

		 this.$http.put(BASEserver+'/articles/'+this.idEDITpost,
			dat
		 )
		  .then(
			  response => {
				  //200
				console.log(response);

						if(response.body)
						{
							if(response.statusText=="OK")
							{
								this.$refs['published_DLG'].open();

								this.clearPOSTForm();

								//reload posts
								this.loadData('posts')
							}
						}
			  }
			  , response => {
				// error callback

				console.log('error callback');
				console.log(response);
				
				
				this.showPostLOADINGerror = true;

				if(response.status==404)
				{
				}
			  });
	},


	doUpdateUser()
	{
			//если загрузили аватарку, то сохраним, прицепим к this.idEDITuser
			if(this.user_avatar)
			{

			  var data = new FormData();
			  data.append('key', this.user_avatar_file);

			  this.$http.post
			  (
			  BASEserver+
			  '/files/multipart/avatar'
			  ,
			  data,
			  { emulateJSON: true }
			  ).then(
			  response => {

				console.log(response);
			  },
			  response => {

				console.log('error callback');
				console.log(response);
			  }
			  );

			}

					  var dat =
					  {
						"nickname": this.signup_login,
						"email": this.signup_email
					  };

							this.$http.put(BASEserver+'/users/'+this.idEDITuser
							 ,
									dat
									)
							.then(response => {

							console.log(response);

							if(response.body)
							{
								if(response.body=="OK")
								{

									this.clearSignupForm();

										this.loadData('users');
								}
							}

				  }, response => {
					// error callback

							console.log('error callback');
							console.log(response);

							if(response.status==409)
							{
									if(response.body)
									{
										if(response.body=="Conflict")
											this.emailSignupAlreadyExists = true;
									}
							}
				  });
	},


    KILLpost: function (post_id) {
		/*
		this.clearPOSTForm();

		var fnd=false;
		var el=null;

		for(i in this.posts_list)
		{
			var post = this.posts_list[i];

			if(post.id==post_id)
			{
				fnd=true;
				el = post;
				break;
			}
		}

		if(fnd)
		{
			this.idEDITpost	= post_id;

								this.post_title			=el.title;
								this.post_subtitle		=el.subtitle;
								this.post_description	=el.description;
								this.post_mediatype		=el.mediatype;
								this.post_medialink		=el.medialink;
								this.post_feed			=el.feedId;
		}
		*/
		alert("KILLpost  not implemented yet")
	},

    validateFEEDForm: function () {

      if (!this.canTrySendFeed) ;
	  else
	  {

		var dat =
				{
				name		:	this.feed_name
			};


		if(this.idEDITfeed>0)
		{
		 this.$http.put(BASEserver+'/feeds/'+this.idEDITfeed
		 ,
			dat
		 )
		  .then(
			  response => {
				  //200
				console.log(response);

						if(response.body)
						{
							if(response.statusText=="OK")
							{
								this.clearFEEDForm();

								//reload feeds
								this.loadData('feeds')
							}
						}
			  }
			  , response => {
				// error callback

				console.log('error callback');
				console.log(response);

				if(response.status==404)
				{
				}
			  });
		}
		else
		{
		//create feed
		 this.$http.post(BASEserver+'/feeds',
			dat
		 )
		  .then(
			  response => {
				  //200
				console.log(response);

						if(response.body)
						{
							if(response.statusText=="OK")
							{
								this.clearFEEDForm();

								//reload feeds
								this.loadData('feeds')
							}
						}
			  }
			  , response => {
				// error callback

				console.log('error callback');
				console.log(response);

				if(response.status==404)
				{
				}
			  });
		}

	  }
	},


    /*
	doOVERLAYsaveStep()
	{
		this.overlaySAVEstep++;

		//сохранить overlay
		if(this.overlaySAVEstep == 2)
		{



		var dat =
				{
				name		:	this.overlay_name,
				previewUuid	:	this.overlay_image_uuid,
				fileUuid	:	this.overlay_media_uuid
			};


		if(this.idEDIToverlay>0)
		{
		 //upadte overlay
		 this.$http.put(BASEserver+'/overays/'+this.idEDIToverlay
		 ,
			dat
		 )
		  .then(
			  response => {
				  //200
				console.log(response);

						if(response.body)
						{
							if(response.statusText=="OK")
							{
								this.clearOverlayForm();

								//reload overlays
								this.loadData('overlays')
							}
						}
			  }
			  , response => {
				// error callback

				console.log('error callback');
				console.log(response);

				if(response.status==404)
				{
				}
			  });
		}
		else
		{
		//create overlay
		 this.$http.post(BASEserver+'/overlays',
			dat
		 )
		  .then(
			  response => {
				  //200
				console.log(response);

						if(response.body)
						{
							if(response.statusText=="OK")
							{
								this.clearOverlayForm();

								//reload overlays
								this.loadData('overlays')
							}
						}
			  }
			  , response => {
				// error callback

				console.log('error callback');
				console.log(response);

				if(response.status==404)
				{
				}
			  });
		}

		}
	},
    */

    validateOverlayForm: function () {

	  this.attemptSubmitOverlay = true;
			  this.showLOADINGspinnerOverlay = false;
			  this.showLOADINGerrorOverlay = false;

      if (!this.canTrySendOverlay) ;
	  else
	  {
			  //вывесить спиннер загрузки и кнопку отмены
			  
			  this.showLOADINGspinnerOverlay = true;

          var data = new FormData();

			  if(this.createNEWoverlay || this.overlay_preview_image_changed)
				data.append('preview', this.overlay_image_file);
			  
			  if(this.createNEWoverlay || this.overlay_media_android_changed)
				data.append('androidFile', this.overlay_media_android_file);
              
			  if(this.createNEWoverlay || this.overlay_media_ios_changed)
				data.append('iosFile', this.overlay_media_ios_file);
			
              data.append('name', this.overlay_name);
              data.append('type', this.overlay_type);

			  if(this.idEDIToverlay>0)
			  {
				  //update overlay
              this.$http.put
              (
              BASEserver+
              '/overlays/multipart/'+this.idEDIToverlay
              ,
              data,
              { emulateJSON: true }
              ).then(
              response => {

                console.log('new overlay uploaded');
                console.log(response);
                //console.log(response.body);

                //ответ не важен. обновлю список overlays_list
                this.clearOverlayForm();
                this.loadData('overlays');

              },
              response => {

                console.log('new overlay NOT uploaded');
				
				this.showLOADINGerrorOverlay = true;

                console.log('error callback');
                console.log(response);
              }
              );
			  }
			  else
			  {
				//create overlay
              this.$http.post
              (
              BASEserver+
              '/overlays/multipart/'
              ,
              data,
              { emulateJSON: true }
              ).then(
              response => {

                console.log('new overlay uploaded');
                console.log(response);
                //console.log(response.body);

                //ответ не важен. обновлю список overlays_list
                this.clearOverlayForm();
                this.loadData('overlays');

              },
              response => {

                console.log('new overlay NOT uploaded');
				
				this.showLOADINGerrorOverlay = true;

                console.log('error callback');
                console.log(response);
              }
              );
				  
			  }

        /*
			 this.overlaySAVEstep = 0;

			  //зашлю сначала media, затем image и потом на 2м шаге - сохраню сам overlay
			  var data = new FormData();

				console.log('overlay media uploading...');
			  data.append('key', this.overlay_media_file);

			  this.$http.post
			  (
			  BASEserver+
			  '/files/multipart/media'
			  ,
			  data,
			  { emulateJSON: true }
			  ).then(
			  response => {

				console.log('overlay media uploaded');
				console.log(response);
				//console.log(response.body);

				this.overlay_media_uuid = response.body.uuid;

				this.doOVERLAYsaveStep();
			  },
			  response => {

				console.log('overlay media NOT uploaded');

				console.log('error callback');
				console.log(response);
			  }
			  );

			  //шаг 2
			  var data = new FormData();

			  data.append('key', this.overlay_image_file);


				console.log('overlay image uploading...');
			  this.$http.post
			  (
			  BASEserver+
			  '/files/multipart/media'
			  ,
			  data,
			  { emulateJSON: true }
			  ).then(
			  response => {

				console.log('overlay image uploaded');
				console.log(response);
				//console.log(response.body);

				this.overlay_image_uuid = response.body.uuid;

				this.doOVERLAYsaveStep();
			  },
			  response => {

				console.log('overlay image NOT uploaded');
				console.log('error callback');
				console.log(response);
			  }
			  );
        */


	  }
	},

    validateCommentForm: function () {

		this.attemptSubmitCOMMENT = true;

      if (!this.canTrySendComment) ;
	  else
	  {

		var dat =
				{
				text		:	this.comment_text,
				articleId	:	this.comment_post_id
			};


		if(this.idEDITcomment>0)
		{
		 this.$http.put(BASEserver+'/comments/'+this.idEDITcomment
		 //post создаёт коммент к /:articleId
		 //this.$http.post(BASEserver+'/comments/'+this.idEDITcomment
		 ,
			dat
		 )
		  .then(
			  response => {
				  //200
				console.log(response);

						if(response.body)
						{
							if(response.statusText=="OK")
							{
								this.clearCommentForm();

								//reload comments
								this.loadData('comments')
							}
						}
			  }
			  , response => {
				// error callback

				console.log('error callback');
				console.log(response);

				if(response.status==404)
				{
				}
			  });
		}
		else
		{
		//create comment
		 this.$http.post(BASEserver+'/comments',
			dat
		 )
		  .then(
			  response => {
				  //200
				console.log(response);

						if(response.body)
						{
							if(response.statusText=="OK")
							{
								this.clearCommentForm();

								//reload comments
								this.loadData('comments')
							}
						}
			  }
			  , response => {
				// error callback

				console.log('error callback');
				console.log(response);

				if(response.status==404)
				{
				}
			  });
		}

	  }
	},
	
	POLLsetActive(poll_id,is_active)
	{
		var dat =
				{
				active		:	is_active
			};

		 this.$http.put(BASEserver+'/polls/'+poll_id
		 ,
			dat
		 )
		  .then(
			  response => {
				  //200
				console.log(response);

						if(response.body)
						{
							if(response.statusText=="OK")
							{

								//reload polls
								this.loadData('polls')
							}
						}
			  }
			  , response => {
				// error callback

				console.log('error callback');
				console.log(response);

				if(response.status==404)
				{
				}
			  });
		
	},	


    validatePollForm: function () {

		this.attemptSubmitPOLL = true;

      if (!this.canTrySendPoll) ;
	  else
	  {

		var dat =
				{
				name		:	this.poll_name,
				active		:	this.poll_active
			};


		if(this.idEDITpoll>0)
		{
		 this.$http.put(BASEserver+'/polls/'+this.idEDITpoll
		 ,
			dat
		 )
		  .then(
			  response => {
				  //200
				console.log(response);

						if(response.body)
						{
							if(response.statusText=="OK")
							{
								this.clearPOLLForm();

								//reload polls
								this.loadData('polls')
							}
						}
			  }
			  , response => {
				// error callback

				console.log('error callback');
				console.log(response);

				if(response.status==404)
				{
				}
			  });
		}
		else
		{
		//create poll
		 this.$http.post(BASEserver+'/polls',
			dat
		 )
		  .then(
			  response => {
				  //200
				console.log(response);

						if(response.body)
						{
							if(response.statusText=="OK")
							{
								this.clearPOLLForm();

								//reload polls
								this.loadData('polls')
							}
						}
			  }
			  , response => {
				// error callback

				console.log('error callback');
				console.log(response);

				if(response.status==404)
				{
				}
			  });
		}

	  }
	},




    validatePOSTForm: function () {
      this.attemptSubmitPOST = true;
      this.showLOADINGerror = false;
      this.showPostLOADINGerror = false;

      if (!this.canTryPOST) ;
	  else
	  {
		  if(this.post_mediatype!='text')
		  {
			  //вывесить спиннер загрузки и кнопку отмены
			  
			  this.showLOADINGspinner = true;
			  
			  var data = new FormData();

			  if(this.createNEWpost)
			  {
				  if(this.post_mediatype=='image')
					data.append('key', this.post_image_file);
				  else
				  if(this.post_mediatype=='video')
					  data.append('key', this.post_media_file);
			  }
			  else
			  {
				if(this.post_mediatype=='video')
				{
					if(this.post_media_changed)
					{
						data.append('key', this.post_media_file);
					}
				}
				else
				{
					if(this.post_image_changed)
					{
						data.append('key', this.post_image_file);
					}
				}
			  }

			  this.$http.post
			  (
			  BASEserver+ '/files/multipart/media'
			  ,
			  data,
			  { emulateJSON: true }
			  ).then(
			  response => {

				console.log(response);
				//console.log(response.body);

				this.post_media_uuid = response.body.uuid;
				
				
				this.showLOADINGspinner = false;

				//и здесь отправить /article
				if(this.idEDITpost>0)
					this.doPOSTupdate();
				else
					this.doPOST();
			  },
			  response => {

				console.log('error callback');
				console.log(response);
				
				this.showLOADINGspinner = false;
				this.showLOADINGerror = true;
				this.showPostLOADINGerror = true;
			  }
			  );
		}
		else
		{
			if(this.idEDITpost>0)
				this.doPOSTupdate();
			else
				this.doPOST();
		}
	  }

    },

    validateLoginForm: function () {
      this.attemptSubmitLogin = true;
      this.wrongLoginEmail = false;
      this.emailLoginNotFound = false;
      this.wrongPwd = false;
	  
      if (!this.canTryLogin) ;
	  else
	  {

		 this.$http.get(BASEserver+'/users/check/email/'+this.login_email
		 ,
							  {credentials:true}
		 )
		  .then(
			  response => {
				  //200
				console.log(response);

						if(response.body)
						{
							if(response.body=="OK")
							{
							  this.doAuth(this.login_email, this.login_pwd, true);
							}
						}
			  }
			  , response => {
				// error callback

				console.log('error callback');
				console.log(response);

				if(response.status==404)
				{
								//неизвестный email
								this.emailLoginNotFound = true;
								this.attemptSubmitLogin = false;

								this.attemptSubmitLogin = true;
				}
				else
				{
					this.loginServerError = true;
				}
			  });
	  }

    },

    validateSignupForm: function () {
      this.attemptSubmitSignup = true;
      this.loginSignupAlreadyExists = false;
	  this.emailSignupAlreadyExists = false;
	  this.wrongEmailSignup = false;

      if (!this.canTrySignup) ;
	  else
	  {
		//проверить на login

      this.$http.get(BASEserver+'/users/check/nickname/'+this.signup_login
	  ,
							  {credentials:true}
	  )
	  .then(
		  response => {
			  //200
			console.log(response);

					if(response.body)
					{
						//есть такой login
						if(response.body=="OK")
						{
							var err = false;
							if(this.idEDITuser>0)
							{
								if(this.signup_login != this.prev_login)
									err=true;
								else
								{
									//check email
									 this.$http.get(BASEserver+'/users/check/email/'+this.login_email
									 ,
														  {credentials:true}
									 )
									  .then(
										  response => {
											  //200
											console.log(response);

													if(response.body)
													{
														if(response.body=="OK")
														{
														  //email exists и не предыдущий, то ошибка
														  if(this.prev_email!=this.signup_email)
														  {
															this.emailSignupAlreadyExists = true;
															this.attemptSubmitLogin = false;

															this.attemptSubmitLogin = true;
														  }
														  //норм email, предыдущий - обновить
														  else
														  {
															console.log('1454 doUpdateUser')
															this.doUpdateUser();
														  }
														}
													}
										  }
										  , response => {
											// error callback

											console.log('error callback');
											console.log(response);

											if(response.status==404)
											{
															//неизвестный email
															console.log('1469 doUpdateUser')
															this.doUpdateUser();

											}
										  });

									//if email==prev_email или email новый то
									//update user
								}
							} else err=true;

							if(err)
							{
								//console.log('this.loginSignupAlreadyExists = true;');
								this.loginSignupAlreadyExists = true;
								this.attemptSubmitSignup = false;
								//console.log('this.loginSignupAlreadyExists = true;');
								this.attemptSubmitSignup = true;
							}
						}
					}
		  }
		  , response => {
			// error callback

			console.log('error callback');
			console.log(response);

			if(response.status==404)
			{
					  var dat =
					  {
						"nickname": this.signup_login,
						"email": this.signup_email
					  };

					  if(this.idEDITuser>0)
						  ;
					  else
					  {
						if((this.authId && this.isPath('/users')) || !(this.authId))
						{
							dat.password = this.signup_pwd;
						}
					  }


						if(this.idEDITuser>0)
						{
								//update user
								console.log('1519 doUpdateUser')
								this.doUpdateUser();
						}
				  else
				  {
					  //create user
					  this.$http.post(BASEserver+'/users'
					  ,
									dat
									)
							.then(response => {

							console.log(response);

							if(response.body)
							{
								if(response.body.id)
								{

									this.clearSignupForm();

									if(this.createNEWuser)
									{
										this.loadData('users');
									}
									else
									this.doAuth(this.signup_email, this.signup_pwd, false);

								}
							}

				  }, response => {
					// error callback

							console.log('error callback');
							console.log(response);

							if(response.status==409)
							{
									if(response.body)
									{
										if(response.body=="Conflict")
											this.emailSignupAlreadyExists = true;
									}
							}
				  });
			}
		  }


	  }
	  );
	  }
    },
  }
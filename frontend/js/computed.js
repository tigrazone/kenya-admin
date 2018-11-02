var theComputed =
{

    orderedPOSTItems: function () {
      if(this.post_feed_id_filter<1)
		return _.orderBy(this.posts_list, this.orderField, this.direction)
	else
		return _.orderBy(this.posts_by_feed[this.post_feed_id_filter], this.orderField, this.direction)
		
    },

    orderedFEEDItems: function () {
      return _.orderBy(this.feeds_list, this.orderField, this.direction)
    },

    orderedPOLLItems: function () {
      return _.orderBy(this.polls_list, this.orderField, this.direction)
    },

    orderedUSERItems: function () {
      return _.orderBy(this.users_list, this.orderField, this.direction)
    },

    orderedCOMMENTItems: function () {
      return _.orderBy(this.comments_list, this.orderField, this.direction)
    },

    orderedOVERLAYItems: function () {
        return _.orderBy(this.overlays_list, this.orderField, this.direction)
    },


    missingPOSTtitle: function () {
	return false; //вычеркиваем из обязательных	
		
	var n=this.post_title; if(n.length>0) n=n.trim();
	return !(n.length); },

    missingPOSTdescription: function () {
	return false; //вычеркиваем из обязательных
	
	var n=this.post_description; if(n.length>0) n=n.trim();
	return !(n.length); },

    missingPOSTmedia: function () {
		
		if(this.createNEWpost || (!this.createNEWpost && this.prev_post_mediatype=='text'))
		{
			if(this.post_mediatype=='image') return !(this.post_image);
			if(this.post_mediatype=='video') return !(this.post_media_sel);
		}
		else
		{
			//если тип медиа не поменялся, то
			if(this.prev_post_mediatype==this.post_mediatype)
			{
				//image если не загрузили - то и фиг с ним
				//video если не загрузили - то и фиг с ним
				return false; //нас устроит, есть файл или нет файла
			}
			
			//сравнивать с предыдущим типом медиа
			switch(this.prev_post_mediatype)
			{
				case 'image':
						if('text'==this.post_mediatype)
						{
							return false; //то есть если текст - новый тип, то медиа неважно
						}
						//video
						else
						{
							//есть видео - хорошо
							//не меняли видео - хорошо
							//то есть при любом раскладе хорошо
							return false;
						}
						break;
				case 'video':
						if('text'==this.post_mediatype)
						{
							return false; //то есть если текст - новый тип, то медиа неважно
						}
						//image
						else
						{
							//есть image - хорошо
							//не меняли image - хорошо
							//то есть при любом раскладе хорошо
							return false;
						}
						break;
			}
		}
		
	return false; },

    missingPOSTfeed: function () {
		 return (this.post_feed<1)
		 ; },


    canTryPOST: function () {
	//console.log('missingPOSTmedia='+this.missingPOSTmedia);
	//console.log('missingPOSTfeed='+this.missingPOSTfeed);

	  return !(this.missingPOSTtitle || this.missingPOSTdescription || this.missingPOSTmedia || this.missingPOSTfeed);
	  },

	  //validatePOSTForm

    missingLoginEmail: function () {
	var n=this.login_email; if(n.length>0) n=n.trim();
	return !(n.length); },

    goodLoginEmail: function () {
	var n=this.login_email; if(n.length>0) n=n.trim();
	/*
	console.log("goodLoginEmail "+n)
	console.log("n.length>0 && n.indexOf('@')>0")
	console.log(n.length>0 && n.indexOf('@')>0)
	*/
	if(n.length>0 && n.indexOf('@')>0)
	{
		/*
		console.log("eml_regexp.test(n)");
		console.log(eml_regexp.test(n));
		*/
		return eml_regexp.test(n);
	}
	return true;
	},

    goodLoginEmailCAN: function () {
	var n=this.login_email; if(n.length>0) n=n.trim();
	/*
	console.log("goodLoginEmail "+n)
	console.log("n.length>0 && n.indexOf('@')>0")
	console.log(n.length>0 && n.indexOf('@')>0)
	*/
	if(n.length>0 && n.indexOf('@')>0)
	{
		/*
		console.log("eml_regexp.test(n)");
		console.log(eml_regexp.test(n));
		*/
		return eml_regexp.test(n);
	}
	return false;
	},

    missingPwd: function () {
	var n=this.login_pwd; if(n.length>0) n=n.trim();
	return !(n.length); },

    userAccessDenied: function () {
	var n=this.login_email; if(n.length>0) n=n.trim();
	
	return n!= access_only_email
	},

    canTryLoginNoCheckAccess: function () {
	  return !(!this.goodLoginEmailCAN || this.missingLoginEmail || this.missingPwd
	  );
	  },

    canTryLogin: function () {
	  return !(!this.goodLoginEmailCAN || this.missingLoginEmail || this.missingPwd
				|| this.userAccessDenied
	  );
	  },

	  //signup
    missingFeedName: function () {
	var n=this.feed_name; if(n.length>0) n=n.trim();
	return !(n.length); },

    missingLoginSignup: function () {
	var n=this.signup_login; if(n.length>0) n=n.trim();
	return !(n.length); },

    missingPwdSignup: function () {
	if(this.idEDITuser)		
		return false;
		
	var n=this.signup_pwd; if(n.length>0) n=n.trim();
	return !(n.length); },

    missingEmailSignup: function () {
	var n=this.signup_email; if(n.length>0) n=n.trim();
	return !(n.length); },

    goodSignupEmail: function () {
	var n=this.signup_email; if(n.length>0) n=n.trim();
	if(n.length>0 && n.indexOf('@')>0)
	{
		return eml_regexp.test(n);
	}
	return true;
	},

    canTrySignup: function () {
	  return !(this.missingLoginSignup 
	  ||
	  this.missingPwdSignup
	  ||
	  this.missingEmailSignup || !this.goodSignupEmail); },

    canTrySendFeed: function () {
	  return !(this.missingFeedName);  },


	  //overlay
    missingOverlayName: function () {
	var n=this.overlay_name; if(n.length>0) n=n.trim();
	return !(n.length); },
	
    missingOverlayType: function () {
	var n=this.overlay_type; if(n.length>0) n=n.trim();
	return !(n.length); },

    missingOVERLAYmedia: function () {
		
		if(this.createNEWoverlay)
		{
			return !this.overlay_media_android_sel || !this.overlay_media_ios_sel;
		}
		else
		{
			return false;
		}
	},

    missingOVERLAYimage: function () {
		
		if(this.createNEWoverlay)
		{
			return !this.overlay_image;
		}
		else
		{
			return false;
		}
	},

    canTrySendOverlay: function () {

	  return !(this.missingOverlayName || this.missingOverlayType || this.missingOVERLAYimage || this.missingOVERLAYmedia);  },

	  //comment
    missingCommentText: function () {
	var n=this.comment_text; if(n.length>0) n=n.trim();
	return !(n.length); },

    canTrySendComment: function () {
	  return !(this.missingCommentText || this.comment_post_id<1);  },
	  
	  //poll
    missingPollName: function () {
	var n=this.poll_name; if(n.length>0) n=n.trim();
	return !(n.length); },

    canTrySendPoll: function () {
	  return !(this.missingPollName);  },
  }
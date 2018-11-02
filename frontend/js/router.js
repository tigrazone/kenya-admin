

const OnePostPage = {
  name: 'OnePostPage',
  template: '#one_post_',
			watch:
			{
				'$route' (to, from)
				{					
					//alert('10 '+to.params.post_id)
					var postID = to.params.post_id;
					
					var d=document.getElementById('post_id_prepare');
					d.value=postID;
					
					var d=document.getElementById('get_post_do');
					d.click();
					
					//App.getPost(postID);
				}
			},
            created: function() {
                console.log("one POST PAGE")
				//alert('15 '+this.$route.params.post_id)
					var postID = this.$route.params.post_id;
					
					var d=document.getElementById('post_id_prepare');
					d.value=postID;
					
					var d=document.getElementById('get_post_do');
					d.click();
					
					//App.getPost(postID);
            }
}

const PostsPage = {
  name: 'PostsPage',
  template: '#posts_',
            created: function() {
                console.log("POSTS PAGE")
            }
}


const CommentsPage = {
  name: 'CommentsPage',
  template: '#comments_',
            created: function() {
                console.log("COMMENTS PAGE")
            }
}

const FeedsPage = {
  name: 'FeedsPage',
  template: '#feeds_',
            created: function() {
                console.log("FEEDS PAGE")
            }
}

const PollsPage = {
  name: 'PollsPage',
  template: '#polls_',
            created: function() {
                console.log("POLLS PAGE")
            }
}

const OverlaysPage = {
  name: 'OverlaysPage',
  template: '#overlays_',
            created: function() {
                console.log("OVERLAYS PAGE")
            }
}

const UsersPage = {
  name: 'UsersPage',
  template: '#users_',
            created: function() {
                console.log("USERS PAGE")
            }
}

const LoginPage = {
  name: 'LoginPage',
  template: '#login_'
}

const NotFoundPage = {
  name: 'NotFoundPage',
            template: "#"+BASEaddr1+"_",
            created: function() {
                window.location.replace("#"+BASEaddr,true)
            }
}

const LogoutPage = {
  name: 'LogoutPage',
            template: "#logout_"

			,
            created: function() {

                window.location.replace("#"+BASEaddr,true)
            }

}



function requireAuth (to, from, next) {
  if (!store.getters.isAuthenticated) {
    //window.location.href = '#/login'
	router.push('/login')
  } else {
    next()
  }
}



const routes = [
  { path: '/posts', component: PostsPage,
    beforeEnter: requireAuth },
	
  { path: '/post/:post_id', component: OnePostPage,
    beforeEnter: requireAuth },

  { path: '/comments', component: CommentsPage,
    beforeEnter: requireAuth },

  { path: '/feeds', component: FeedsPage,
    beforeEnter: requireAuth },

  { path: '/polls', component: PollsPage,
    beforeEnter: requireAuth },

  { path: '/overlays', component: OverlaysPage,
    beforeEnter: requireAuth },

  { path: '/users', component: UsersPage,
    beforeEnter: requireAuth },

  { path: '/logout', component: LogoutPage },

  { path: '/login', component: LoginPage },

  { path: '*', component: NotFoundPage },
]

const router = new VueRouter({
  routes,
  store
});

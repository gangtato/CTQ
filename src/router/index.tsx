import Users from "../views/users";
import Posts from "../views/posts";
import { Switch, BrowserRouter, Route, Redirect, Link } from "react-router-dom";

export const routes = [
    {
      name: "Users",
      component: Users,
      path:"/users",
      exact:false
    },
    {
      name: "Posts",
      component: Posts,
      path:"/posts",
      exact:false
    }
];

function Routes() {
    return(
      <BrowserRouter>
      <div className="text-center my-4">
        <Link to="/users" className="border px-4 py-2 my-2 bg-blue-500 rounded text-white">Users</Link>
        <Link to="/posts" className="border px-4 py-2 my-2 bg-green-500 rounded text-white">Posts</Link>
      </div>
        
        <Switch>
          {routes.map((route, index) => {
            return (
              <Route
                key={index}
                path={route.path}
                exact={route.exact}
                component={route.component}
              />
            );
          })}
          <Redirect from='*' to='/users' />
        </Switch>
      </BrowserRouter>
    );
}

export default Routes;

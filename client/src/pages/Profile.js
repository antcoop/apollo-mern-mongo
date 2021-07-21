import React from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import Auth from '../utils/auth';
import { QUERY_USERS, QUERY_USER, QUERY_ME } from '../utils/queries';


const Profile = () => {
  const { id } = useParams();

  // Get current user
  const { loading, data } = useQuery(userParam ? QUERY_USER : QUERY_ME, {
    variables: { _id: id },
  });

  // Get a list of all users
  const { usersLoading, data: usersData } = useQuery(QUERY_USERS);

  const user = data?.me || data?.user || {};
  const users = usersData?.users || [];

  // redirect to personal profile page if username is yours
  if (Auth.loggedIn() && Auth.getProfile().data._id === id) {
    return <Redirect to="/me" />;
  }

  if (loading) {
    return <h4>Loading...</h4>;
  }

  if (!user?.username) {
    return (
      <h4>
        You need to be logged in to see this. Use the navigation links above to
        sign up or log in!
      </h4>
    );
  }

  const renderUserList = () => {
    if (!usersLoading) return null;
    return (
      <div className="col-12 col-md-10 mb-5">
        <UserList users={users} title={``} />
      </div>
    );
  };

  const renderCurrentUserInfo = () => {
    if (!id) return null;
    return (
      <ul>
        <li>username: {user.username}</li>
        <li>email: {user.email}</li>
      </ul>
    );
  }

  return (
    <div>
      <div className="flex-row justify-center mb-3">
        <h2 className="col-12 col-md-10 bg-dark text-light p-3 mb-5">
          Viewing {id ? `${user.username}'s` : 'your'} profile.
        </h2>
        {renderCurrentUserInfo()}
        {renderUserList()}
      </div>
    </div>
  );
};

export default Profile;

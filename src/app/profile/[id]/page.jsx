import React from 'react';

const UserProfile = ({params}) => {
    return (
        <section className={` flex flex-col min-h-screen justify-center items-center `} >
            <h2> User Profile </h2>
            <p> Profile page <span className={`p-1 px-3 rounded-md text-white bg-yellow-400`} >{params.id}</span> </p>
        </section>
    );
};

export default UserProfile;

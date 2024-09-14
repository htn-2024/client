import React, { useState } from 'react';

const LoginPage = () => {

  return (
    <div>
      Page for google auth
      <button onClick={() => {window.location.href = "/create-memory";}}>Go to gallery</button>
    </div>
  );
};

export default LoginPage;

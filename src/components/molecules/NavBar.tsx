import React, { useState, useContext } from 'react';
import axios from 'axios';
import styled from "styled-components";
import { stopRecording } from "../../api/recording";
import { useGlobalInfoStore } from "../../context/globalInfo";
import { IconButton } from "@mui/material";
import { RecordingIcon } from "../atoms/RecorderIcon";
import { SaveRecording } from "./SaveRecording";
import { Logout, Clear } from "@mui/icons-material";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth';

interface NavBarProps {
  newRecording: () => void;
  recordingName: string;
  isRecording: boolean;
}

export const NavBar: React.FC<NavBarProps> = ({ newRecording, recordingName, isRecording }) => {

  const { notify, browserId, setBrowserId, recordingLength, recordingUrl, setRecordingUrl } = useGlobalInfoStore();
  const { state, dispatch } = useContext(AuthContext);
  const { user } = state;
  const [isModalOpen, setModalOpen] = useState(false);

  console.log(`Recording URL: ${recordingUrl}`)

  const navigate = useNavigate();

  const logout = async () => {
    dispatch({ type: 'LOGOUT' });
    window.localStorage.removeItem('user');
    const { data } = await axios.get('http://localhost:8080/auth/logout');
    notify('success', data.message);
    navigate('/login');
  };

  // If recording is in progress, the resources and change page view by setting browserId to null
  // else it won't affect the page
  const goToMainMenu = async () => {
    if (browserId) {
      await stopRecording(browserId);
      notify('warning', 'Current Recording was terminated');
      setBrowserId(null);
    }
    navigate('/');
  };

  return (
    <NavBarWrapper>
      <div style={{
        display: 'flex',
        justifyContent: 'flex-start',
      }}>
        <RecordingIcon />
        <div style={{ padding: '11px' }}><ProjectName>Maxun</ProjectName></div>
      </div>
      {
        user !== null ? (
          <>
            <div style={{
              display: 'flex',
              justifyContent: 'flex-end',
            }}>
              {
                !isRecording ? (
                  <>
                    <IconButton sx={{
                      width: '140px',
                      borderRadius: '5px',
                      padding: '8px',
                      background: '#ff00c3',
                      color: 'white',
                      marginRight: '10px',
                      fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                      fontWeight: '500',
                      fontSize: '0.875rem',
                      lineHeight: '1.75',
                      letterSpacing: '0.02857em',
                      '&:hover': { color: 'white', backgroundColor: '#ff00c3' }
                    }} onClick={logout}>
                      <Logout sx={{ marginRight: '5px' }} />
                      Logout</IconButton>
                  </>
                ) : 
                <>
                <IconButton sx={{
                  width: '140px',
                  borderRadius: '5px',
                  padding: '8px',
                  background: 'red',
                  color: 'white',
                  marginRight: '10px',
                  fontFamily: '"Roboto","Helvetica","Arial",sans-serif',
                  fontWeight: '500',
                  fontSize: '0.875rem',
                  lineHeight: '1.75',
                  letterSpacing: '0.02857em',
                  '&:hover': { color: 'white', backgroundColor: 'red' }
                }} onClick={goToMainMenu}>
                  <Clear sx={{ marginRight: '5px' }} />
                  Discard</IconButton>
                  <SaveRecording fileName={recordingName} />
                </>
              }
            </div>
          </>
        ) : ""
      }

    </NavBarWrapper>
  );
};

const NavBarWrapper = styled.div`
  grid-area: navbar;
  background-color: white;
  padding:5px;
  display: flex;
  justify-content: space-between;
`;

const ProjectName = styled.b`
  color: #3f4853;
  font-size: 1.3em;
`;

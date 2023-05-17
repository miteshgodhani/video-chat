/* eslint-disable react-hooks/exhaustive-deps */
import {
  Button,
  Card,
  Col,
  Divider,
  Input,
  message,
  Row,
  Space,
  Typography,
} from "antd";
import React, { useContext, useEffect, useState } from "react";
import { SocketContext } from "./Context";


function App() {
  const {
    answerCall,
    callAccepted,
    myVideo,
    userVideo,
    callEnded,
    call,
    me,
    callUser,
    leaveCall,
  } = useContext(SocketContext);

  const [roomID, setroomID] = useState("");
  const [Requested, setRequested] = useState(false);

  const joined = Boolean(String(window.location?.pathname).slice(1)?.length);

  useEffect(() => {
    setroomID(String(window.location?.pathname).slice(1));
  }, [window.location.pathname]);

  const handleJoinRoom = () => {
    if (roomID?.length > 0) {
      callUser(roomID);
      setRequested(true);
    } else {
      message.error("Please enter room ID");
    }
  };


  const isCallOnGoing = callAccepted && !callEnded

  const [fullView, setfullView] = useState(false)
  return (
    <div className="app">
      <h3 className="app-name" align="center">
        Video Chat
      </h3>

    <div className="app-body">
      <Row style={{ padding:10,  display:"flex", flex:1, position:"relative" }} >
        <Col
          xs={24} sm={24} md={12} lg={12} xl={12}
        >
          <div className={fullView ? "my-video-full": "my-video"}>
          <video
            playsInline
            muted
            ref={myVideo}
            autoPlay
            style={{
              width: "100%",
              transform: "rotateY(180deg)",
            }}
          />
        </div>
              
          {!isCallOnGoing && !joined && (
            <>
            <Typography.Text style={{ marginTop: 40 }} type={!me && "danger"}>
              Your Meeting ID : {me || "Unable to connect server"}{" "}
            </Typography.Text>
            <Button
            disabled={!me}
              onClick={() => {
                navigator.clipboard.writeText(
                  window.location.origin + "/" + me
                );
                message.success("Link copied successfully");
              }}
            >
              Generate Meeting Link
            </Button>
            </>
          )}


        </Col>

        <Col  xs={24} sm={24} md={12} lg={12} xl={12} className="right-part" style={{position:"relative"}}>
          <div className={fullView ? "peer-video-full" : "peer-video"}>
          <video
            playsInline
            ref={userVideo}
            autoPlay
            muted
            style={{
              width: "100%",
              transform: "rotateY(180deg)",
              position:"absolute"
            }}
          />
          </div>

          {!callAccepted && !callEnded && (
            <div className="App" style={{ textAlign: "center" }}>
              <Row align={"center"}>
                {!joined ? (
                  <Card>
                    <Space direction="vertical">
                      <Input
                        placeholder="Enter Room ID"
                        value={roomID}
                        onChange={(e) => setroomID(e.target.value)}
                      />
                      <Divider />
                      <Row justify={"center"}>
                        <Col>
                          <Button
                            type="primary"
                            onClick={handleJoinRoom}
                            disabled={!me}
                          >
                            Join Room
                          </Button>
                        </Col>
                      </Row>
                    </Space>
                  </Card>
                ) : (
                  <Button
                    type="primary"
                    onClick={handleJoinRoom}
                    disabled={!me}
                  >
                    Request to join the room Join Room
                  </Button>
                )}
              </Row>
              <Typography.Text>
                {Requested && "Please wait while someone let you in"}
              </Typography.Text>
            </div>
          )}

        </Col>
        
      </Row>
      
      <div className="app-footer d-center" >
      {call.isReceivingCall && !callAccepted && (
        <Row justify={"center"} style={{ alignItems: "center" }}>
          <Typography.Text>Someone wants to join the call</Typography.Text>
          <Button onClick={answerCall} type="link">
            Accept
          </Button>
        </Row>
      )}

      {isCallOnGoing && (
        <>
        <Row justify={"center"} gutter={[10,10]} style={{ alignItems: "center" }}>
          <Col>
          <Button onClick={() => setfullView (old => !old)} >Change Layout</Button>
          </Col>
          <Col>
          <Button onClick={leaveCall} danger>
            Leave Call
          </Button>
          </Col>
        </Row>
        </>
      )}
      </div>
      </div>

    </div>
  );
}

export { App };

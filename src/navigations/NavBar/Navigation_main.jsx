import { Drawer, List, ListItem, ListItemText } from "@mui/material";
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

import AdbIcon from "@mui/icons-material/Adb";
import AppBar from "@mui/material/AppBar";
import Avatar from "@mui/material/Avatar";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Container from "@mui/material/Container";
import IconButton from "@mui/material/IconButton";
import { Image } from "react-bootstrap";
import Logo from "../../assets/logo.png";
import MenuIcon from "@mui/icons-material/Menu";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import routes_main from "../../routes/routes_main";

function ResponsiveAppBar() {
  const [anchorElNav, setAnchorElNav] = useState(null);
  const [anchorElUser, setAnchorElUser] = useState(null);
  const [subNavItems, setSubNavItems] = useState([]); // State to hold sub-navigation items
  const [subNavTitles, setSubNavTitles] = useState([]); // State to hold sub-navigation titles
  const [subNavVisible, setSubNavVisible] = useState(false); // State to track hover visibility
  const [subNavVisibleXS, setSubNavVisibleXS] = useState(false); // State to track hover visibility
  const pages = routes_main();
  const navigate = useNavigate();
  useEffect(() => {
    // document.title = window.localStorage.getItem("pageName");
  }, []);
  const handleCloseUserMenu = () => {
    setAnchorElUser(null);
  };

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleOpenNavMenu = () => {
    setDrawerOpen(true);
  };

  const handleCloseNavMenu = () => {
    setDrawerOpen(false);
  };

  const handleNavItemClick = (page) => {
    let pagename = "";
    // if (page.path === "/Home") {
    //   pagename = "Barangay Dicklum Official Website";
    // } else {
    //   pagename = page.title;
    // }

    if (page.hasMultiple_Sub_Routes) {
      setSubNavItems(page.subPages || []);
      setSubNavTitles(page.subPageTitles || []);
      navigate(page.path);
    } else {
      setSubNavItems([]);
      setSubNavTitles([]);
      setSubNavVisible(false);
      navigate(page.path);
      window.localStorage.setItem("pageName", pagename);
      // location.reload();
    }
  };
  const handleNavItemClick_ = (page) => {
    let pagename = "";
    // if (page.path === "/Home") {
    //   pagename = "Barangay Dicklum Official Website";
    // } else {
    //   pagename = page.title;
    // }
    if (page.hasMultiple_Sub_Routes) {
      setSubNavItems(page.subPages || []);
      setSubNavTitles(page.subPageTitles || []);
      setSubNavVisibleXS(true);
    } else {
      setSubNavItems([]);
      setSubNavTitles([]);
      setSubNavVisibleXS(false);
      navigate(page.path);
      //window.localStorage.setItem("pageName", pagename);
      //location.reload();
    }
  };

  const handleMouseEnter = (page) => {
    if (page.hasMultiple_Sub_Routes) {
      setSubNavItems(page.subPages || []);
      setSubNavTitles(page.subPageTitles || []);
      setSubNavVisible(true);
    } else {
      setSubNavVisible(false);
    }
  };

  const handleMouseLeave = () => {
    setSubNavVisible(false);
  };

  const handleMouseLeave_ = () => {
    setSubNavVisibleXS(false);
  };
  return (
    <AppBar
      variant="transparent"
      sx={{
        p: 0,
        m: 0,
        zIndex: (theme) => theme.zIndex + 1,
        backgroundColor: "white",
      }}
    >
      <Container maxWidth="xl">
        <Toolbar sx={{ mt: 2 }} disableGutters>
          {/* Mobile Menu Button */}
          <Box sx={{ flexGrow: 1, display: { xs: "flex", md: "none" } }}>
            <IconButton
              size="large"
              aria-label="open navigation drawer"
              aria-controls="menu-appbar"
              aria-haspopup="true"
              onClick={handleOpenNavMenu}
              color="black"
            >
              <MenuIcon />
            </IconButton>

            <Drawer
              anchor="left"
              open={drawerOpen}
              onClose={handleCloseNavMenu}
              sx={{
                display: { xs: "block", md: "none" },
              }}
              role="presentation"
            >
              <Box
                sx={{ width: 300 }}
                //onClick={handleCloseNavMenu}
                // onKeyDown={handleCloseNavMenu}
              >
                <List>
                  {pages.map((page, index) => {
                    if (!page.isHidden) {
                      return (
                        <ListItem
                          button
                          onClick={() => handleNavItemClick_(page)}
                          key={index}
                        >
                          {page.isIconOnly ? (
                            <ListItemText className="nav-item-hover">
                              {page.icon} {page.title}
                            </ListItemText>
                          ) : (
                            <ListItemText
                              className="nav-item-hover"
                              primary={page.title}
                            />
                          )}
                        </ListItem>
                      );
                    }
                  })}
                </List>
                {subNavVisibleXS && (
                  <div onMouseLeave={handleMouseLeave_}>
                    {subNavItems.length > 0 && (
                      <div>
                        {subNavTitles.map((item, index_) => {
                          if (
                            subNavItems.filter((subNavItem_) => {
                              if (item.title === subNavItem_.subPageGroup) {
                                return subNavItem_;
                              }
                            }).length > 0
                          ) {
                            return (
                              <div key={index_}>
                                <h6
                                  style={{ fontWeight: "bolder", fontSize: 13 }}
                                  className=" text-success"
                                >
                                  {item.icon} {item.title.toUpperCase()}
                                </h6>
                                <List>
                                  {subNavItems.map((subNavItem, index) => {
                                    if (
                                      item.title === subNavItem.subPageGroup
                                    ) {
                                      return (
                                        <ListItem
                                          button
                                          key={index}
                                          onClick={() => {
                                            navigate(subNavItem.path);
                                          }}
                                        >
                                          <a
                                            style={{ fontSize: 12 }}
                                            className="text-black pointer"
                                          >
                                            {subNavItem.title.toUpperCase()}
                                          </a>
                                        </ListItem>
                                      );
                                    }
                                  })}
                                </List>
                              </div>
                            );
                          }
                        })}
                      </div>
                    )}
                  </div>
                )}
              </Box>
            </Drawer>
          </Box>

          {/* Logo */}
          <Box
            sx={{
              display: "flex",
              flexDirection: { xs: "column", md: "row" },
              alignItems: { xs: "flex", md: "flex-start" },
              flexGrow: 1,
              justifyContent: "center",
              alignSelf: "center",
              width: "inherit",
            }}
          >
            <Image
              onClick={() => {
                navigate("/home");
                document.title = "Weather  Cyclone Tracker";
              }}
              className="pointer"
              style={{
                width: "10vw",
                maxWidth: "70px",
                minWidth: "70px",
                marginTop: "10px",
                marginRight: "1rem",
              }}
              src={Logo}
              alt="Logo"
            />

            {/* Titles */}
            <Box
              sx={{
                flexGrow: 1,
                mt: 2,
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                height: { xs: 0, md: "120px" }, // Set height to the full viewport height to center it vertically within the screen
              }}
            >
              <div className="col" style={{ textAlign: "center" }}>
                {" "}
                {/* Add textAlign to center the text horizontally */}
                <Typography
                  variant="h4"
                  noWrap
                  sx={{
                    display: { xs: "none", md: "flex" },
                    fontFamily: "monospace",
                    fontWeight: "bold",
                    color: "black",
                    textDecoration: "none",
                    mt: 0,
                    pt: 0,
                  }}
                >
                  CYCLONE TRACKER
                </Typography>
                <Typography
                  variant="p"
                  noWrap
                  sx={{
                    display: { xs: "none", md: "flex" },
                    fontFamily: "monospace",
                    fontWeight: 400,
                    fontSize: 13,
                    m: 0,
                    p: 0,
                    color: "black",
                    textDecoration: "none",
                  }}
                >
                  Monitor and track tropical cyclones in the Philippines and
                  surrounding areas
                </Typography>
              </div>
            </Box>
          </Box>

          {/* Menu Items */}
          <Box
            sx={{
              flexGrow: 1,
              display: { xs: "none", md: "flex" },
              justifyContent: "center",
            }}
          >
            {pages.map((page, index) => {
              if (!page.isHidden) {
                return (
                  <>
                    {page.isIconOnly ? (
                      <a
                        className="mx-3 pointer nav-item-hover"
                        key={index}
                        onClick={() => handleNavItemClick(page)}
                        onMouseEnter={() => handleMouseEnter(page)}
                        style={{
                          mx: 1,

                          display: "block",
                          outline: "none",
                          boxShadow: "none",
                          "&:focus": {
                            outline: "none",
                          },
                          "&:active": {
                            outline: "none",
                            boxShadow: "none",
                          },
                        }}
                      >
                        {page.icon}{" "}
                        {/* {page.viewMoreIcon ? page.viewMoreIcon : null} */}
                      </a>
                    ) : (
                      <a
                        className="mx-3 pointer nav-item-hover"
                        key={index}
                        onClick={() => handleNavItemClick(page)}
                        onMouseEnter={() => handleMouseEnter(page)}
                        style={{
                          mx: 1,

                          display: "block",
                          outline: "none",
                          boxShadow: "none",
                          "&:focus": {
                            outline: "none",
                          },
                          "&:active": {
                            outline: "none",
                            boxShadow: "none",
                          },
                          fontSize: 13,
                        }}
                      >
                        {page.title}{" "}
                        {page.viewMoreIcon ? page.viewMoreIcon : null}
                      </a>
                    )}
                  </>
                );
              }
            })}
          </Box>
        </Toolbar>
      </Container>

      {/* Sub Navigation Items */}
      {subNavVisible ? (
        <div
          onMouseLeave={handleMouseLeave}
          className="row  sub-nav-transition mt-4 sub-nav-container"
        >
          <div className="container-fluid">
            {subNavItems.length > 0 && (
              <div className="col-lg-12 col-md-12 col-sm-12">
                <div className="row pb-4 shadow pt-4 ">
                  {subNavTitles.map((item, index_) => {
                    if (
                      subNavItems.filter((subNavItem_) => {
                        if (item.title === subNavItem_.subPageGroup) {
                          return subNavItem_;
                        }
                      }).length > 0
                    ) {
                      return (
                        <div
                          key={index_}
                          className="col-lg-4 col-md-12 col-sm-12 "
                        >
                          <label
                            style={{ fontWeight: "bolder" }}
                            className="text-success"
                          >
                            {item.icon} {item.title.toUpperCase()}
                          </label>
                          <List>
                            {subNavItems.map((subNavItem, index) => {
                              if (item.title === subNavItem.subPageGroup) {
                                return (
                                  <ListItem
                                    button
                                    key={index}
                                    onClick={() => {
                                      navigate(subNavItem.path);
                                    }}
                                  >
                                    <a
                                      style={{ fontSize: 15 }}
                                      className="text-black"
                                    >
                                      {subNavItem.title.toUpperCase()}
                                    </a>
                                  </ListItem>
                                );
                              }
                            })}
                          </List>
                        </div>
                      );
                    }
                  })}
                  <div className="col-lg-12 col-md-12 col-sm-12 d-flex justify-content-end">
                    <div>
                      <img
                        style={{
                          opacity: 0.5,
                          width: 150,
                          zIndex: -1000,
                        }}
                        src={Logo}
                      />
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      ) : null}
    </AppBar>
  );
}

export default ResponsiveAppBar;

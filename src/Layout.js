import React from 'react';
import { Link } from "react-router-dom";
import axios from 'axios';

import {
    Button,
    Dropdown,
    DropdownToggle,
    DropdownItem,
    Nav,
    NavItem,
    NavList,
    NavVariants,
    Page,
    PageHeader,
    PageSection,
    PageSectionVariants,
    PageSidebar,
    Toolbar,
    ToolbarGroup,
    ToolbarItem
} from '@patternfly/react-core';
import accessibleStyles from '@patternfly/react-styles/css/utilities/Accessibility/accessibility';
import { css } from '@patternfly/react-styles';
import logo from './logo.png';

class Layout extends React.Component {

    state = {
        isDropdownOpen: false,
        activeItem: this.props.activeItem,
        user: '',
    };

    componentDidMount() {
        axios.get('http://ci-backend-latest-ci-selfserv.apps.ci.centos.org/user', { withCredentials: true }
        ).then(response => {
            if (response.data.message !== 'Please log in to continue.') {
                this.setState({user: response.data});
            }
            else this.setState({user: ''});
        }).catch(err=>console.log(err))
    }

    login = () => {
        axios.get('http://ci-backend-latest-ci-selfserv.apps.ci.centos.org/login', { withCredentials: true }
        ).then(response => {
            window.location.replace(response.data)
        }).catch(err=>console.log(err))
    };

    logout = () => {
        axios.get('http://ci-backend-latest-ci-selfserv.apps.ci.centos.org/logout', { withCredentials: true }
        ).then(response => {
            if (response.data.message === 'You have successfully logged out' || response.data.message === 'User is already logged out') {
                this.setState({user: ''})
                window.location.reload()
            }
            else console.log('response.data',response.data)
        }).catch(err=>console.log(err))
    };

    onDropdownToggle = isDropdownOpen => {
        this.setState({
            isDropdownOpen
        });
    };

    onDropdownSelect = event => {
        this.setState({
            isDropdownOpen: !this.state.isDropdownOpen
        });
    };

    onNavSelect = result => {
        this.setState({
            activeItem: result.itemId
        });

    };

    render() {
        const { isDropdownOpen, activeItem, user } = this.state;

        const PageNav = (
            <Nav onSelect={this.onNavSelect} aria-label="Nav">
                <NavList variant={NavVariants.default}>
                    <NavItem itemId={0} isActive={activeItem === 0}>
                        <Link to="/projects">Projects</Link>
                    </NavItem>
                    <NavItem itemId={1} isActive={activeItem === 1}>
                        <Link to="/new-request">Create New Request</Link>
                    </NavItem>
                    <NavItem itemId={2} isActive={activeItem === 2}>
                        <Link to="/requests">Project Requests</Link>
                    </NavItem>
                </NavList>
            </Nav>
        );

        const userDropdownItems = [
            <DropdownItem onClick={this.logout} style={{'backgroundColor':'white', 'padding':'10px'}}>Logout</DropdownItem>,
        ];

        const PageToolbar = (
            <Toolbar>
                <ToolbarGroup>
                    <ToolbarItem className={css(accessibleStyles.screenReader, accessibleStyles.visibleOnMd)}>
                        {user ?
                            <Dropdown
                                isPlain
                                position="right"
                                onSelect={this.onDropdownSelect}
                                isOpen={isDropdownOpen}
                                toggle={<DropdownToggle onToggle={this.onDropdownToggle}>Welcome, {user['username']}!</DropdownToggle>}
                                dropdownItems={userDropdownItems}
                            /> :
                            <Button
                                variant="primary"
                                style={{'margin':"20px", "padding":"5px 10px 5px 10px"}}
                                onClick={this.login}
                            >
                                Log In
                            </Button>
                        }
                    </ToolbarItem>
                </ToolbarGroup>
            </Toolbar>
        );
        const Header = (
            <PageHeader
                logo={<Link to="/"><img src={logo} alt="CentOS Logo"/></Link>}
                toolbar={PageToolbar}
                style={{'background-color':'#0B4E94'}}
            />
        );
        const Sidebar = <PageSidebar nav={PageNav} />;

        return (
            <React.Fragment>
                <Page header={Header} sidebar={Sidebar}>
                    <PageSection variant={PageSectionVariants.light} style={{'padding': '25px 25px 25px 25px'}}>
                        {this.props.children}
                    </PageSection>
                </Page>
            </React.Fragment>
        )}
}

export default Layout;

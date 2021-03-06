import React from 'react';
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
        user: '',
    };

    componentDidMount() {

        axios.get('http://ci-backend-ci-selfserv.apps.ci.centos.org'.concat('/user'), { withCredentials: true }
        ).then(response => {
            if (response.data.message !== 'Please log in to continue.') {
                this.setState({user: response.data});
            }
            else {
                this.setState({user: ''});
                console.log(response.data.message)
            }
        }).catch(err=>console.log(err))
    }

    login = () => {
        axios.get('http://ci-backend-ci-selfserv.apps.ci.centos.org'.concat('/login'), { withCredentials: true }
        ).then(response => {
            window.location.replace(response.data)
        }).catch(err=>console.log(err))
    };

    logout = () => {
        axios.get('http://ci-backend-ci-selfserv.apps.ci.centos.org'.concat('/logout'), { withCredentials: true }
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

    render() {
        const { isDropdownOpen, user } = this.state;
        var { child } = this.props;
        var { requestid } = this.props.match.params;

        const PageNav = (
            <Nav aria-label="Nav">
                <NavList variant={NavVariants.default}>
                    <NavItem itemId={0} isActive={window.location.pathname === '/projects'}>
                        <a href={window.location.origin.concat('/projects')}>Projects</a>
                    </NavItem>
                    <NavItem itemId={1} isActive={window.location.pathname === '/new-request'}>
                        <a href={window.location.origin.concat('/new-request')}>Create New Request</a>
                    </NavItem>
                    <NavItem itemId={2} isActive={window.location.pathname === '/requests'}>
                        <a href={window.location.origin.concat('/requests')}>Project Requests</a>
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
                logo={<a href={window.location.origin.concat("/")}><img src={logo} alt="CentOS Logo"/></a>}
                toolbar={PageToolbar}
                style={{'background-color':'#0B4E94'}}
            />
        );
        const Sidebar = <PageSidebar nav={PageNav} />;

        return (
            <React.Fragment>
                <Page header={Header} sidebar={Sidebar}>
                    <PageSection variant={PageSectionVariants.light} style={{'padding': '25px 25px 25px 25px'}}>
                        {child.type.name == "RequestPage" ? 
                        React.cloneElement(child, {user : user, requestid: requestid}) :
                        React.cloneElement(child, {user : user})
                        }
                    </PageSection>
                </Page>
            </React.Fragment>
        )}
}

export default Layout;

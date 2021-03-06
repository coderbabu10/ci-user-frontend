import React from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import {
    Table,
    TableHeader,
    TableBody,
    TableVariant,
} from '@patternfly/react-table';
import { TextInput, Button } from '@patternfly/react-core';

class Requests extends React.Component {

    state = {
        requests: [],
        searchParam: '',
    }

    componentDidMount() {
        this.getRequests()
    }

    getRequests = () => {

        axios.get('http://ci-backend-ci-selfserv.apps.ci.centos.org'.concat('/requests'), { withCredentials: true }
        ).then(res=> {
            if (res.data.message == 'success') {
                this.setState({requests: res.data.requests})
            }
        }).catch(err=>console.log(err))

    }

    setSearchParam = (value) => {
        this.setState({searchParam: value})
    }

    getRequestsByName = () => {

        axios.get('http://ci-backend-ci-selfserv.apps.ci.centos.org'.concat('/requests'),
        {
            withCredentials: true,
            params: {'project_name': this.state.searchParam.trim()} 
        
        }).then(res=> {

            if (res.data.message === 'success') {
                this.setState({requests: res.data.requests})
            }
            else console.log(res.data)

        }).catch(err=>console.log(err))
    }

    getRequestsByID = () => {

        axios.get('http://ci-backend-ci-selfserv.apps.ci.centos.org'.concat('/requests'),
        {
            withCredentials: true,
            params: {'reference_id': this.state.searchParam.trim()} 
        
        }).then(res=> {

            if (res.data.message === 'success') {
                this.setState({requests: res.data.requests})
            }
            else console.log(res.data)
            
        }).catch(err=>console.log(err))
    }

    render() {
        const {requests, searchParam} = this.state;
        const {user} = this.props;

        if (requests.length >= 1) {

            var columns = ['Project Name', 'Requested By', 'Approval Status', 'Request ID', 'More Details']

            var rows = [];

            requests.map(req => {
                var row = []
                row.push(req['project_name'])
                row.push(req['requested_by'])
                row.push(req['status'])
                row.push(req['reference_id'])
                const request_url = '/requests/'.concat(req['reference_id'])
                const request_link = { title: <Link to={request_url}>Go to Request</Link> }
                row.push(request_link)
                rows.push(row)
                return row
            })
        }

        return (
            <div>
            {!user && <div>Please log in to view this page.</div>}
            {user &&
            <div>
                <div style={{'font-size':'35px'}}>Project Requests</div>
                <div>
                    <TextInput style={{'max-width': '600px', 'margin-right': '10px'}} value={searchParam} type="text" onChange={this.setSearchParam} aria-label="text input example" />
                    <Button variant="secondary" style={{'padding': '5px 10px 5px 10px', 'margin': '10px'}} onClick={this.getRequestsByName}>Search by Project Name</Button>
                    <Button variant="secondary" style={{'padding': '5px 10px 5px 10px', 'margin': '10px'}} onClick={this.getRequestsByID}>Search by Request ID</Button>                        
                    <Button variant="secondary" style={{'padding': '5px 10px 5px 10px', 'margin': '10px', 'float': 'right'}} onClick={this.getRequests}>x Remove Filters</Button>
                    <br/><br/>
                </div>
                {requests.length < 1 && <div>No Requests Found </div> }
                {requests.length >= 1 && 
                    <div>
                        <Table variant={TableVariant.compact} cells={columns} rows={rows}>
                            <TableHeader />
                            <TableBody />
                        </Table>
                    </div>
                }
            </div>
            }
            </div>
        )
    }
}

export default Requests
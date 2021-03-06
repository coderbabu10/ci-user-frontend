import React from 'react';
import axios from 'axios';
import Layout from './Layout';
import {
    Form,
    FormGroup,
    TextInput,
    TextArea,
    FormSelectOption,
    FormSelect,
    ActionGroup,
    Button,
    Radio,
    Alert
  } from '@patternfly/react-core';
  
class RequestForm extends React.Component {

    state = {
        options: [],
        project_name: '',
        project_desc: '',
        newProject: true,
        gpg_key: '',
        submitResponse: {},
    };

    componentDidMount() {
      
      // Load existing projects for dropdown list
      axios.get('http://ci-backend-ci-selfserv.apps.ci.centos.org'.concat('/projects'), { withCredentials: true}
      ).then(response => {
        var options = [{value: '', label: '', disabled: false}];

        if (response.data.projects.length > 0) {
          response.data.projects.map(project => {
            var option = { value: project['project_name'], label: project['project_name'], disabled: false}
            options.push(option)
            return option
          })
          this.setState({options})
        }
      }).catch(err=>console.log(err))

    }

    componentWillReceiveProps(newProps) {
      if (newProps.user['gpg_key'] !== "undefined") {
        this.setState({gpg_key: newProps.user['gpg_key']})
      }
    }

    handleRadioButtonChange = (_, event) => {
      this.setState({ newProject: !this.state.newProject });
    }

    onSelectChange = (value, event) => {
        this.setState({ project_name: value });
    }

    handleDescChange = value => {
      this.setState({project_desc: value});
    }

    handleNameChange = value => {
      this.setState({project_name: value});
    }

    handleGpgChange = (value, event) => {
        this.setState({gpg_key: value });
    }

    submit = () => {
      
      var bodyFormData = new FormData();
      bodyFormData.set('username', this.props.user['username']);
      bodyFormData.set('email', this.props.user['email']);
      bodyFormData.set('project_name', this.state.project_name);
      bodyFormData.set('project_desc', this.state.project_desc);
      bodyFormData.set('gpg_key', this.state.gpg_key);
      bodyFormData.set('new_project', this.state.newProject);

      axios({
        method: 'post',
        url: 'http://ci-backend-ci-selfserv.apps.ci.centos.org'.concat('/new-request'),
        data: bodyFormData,
        withCredentials: true
        })
        .then(response => {
          this.setState({submitResponse: response.data, project_desc: '', project_name: ''});
        })
        .catch(response => {
            console.log(response.data.message);
        });
    }
  
    render() {
        const { options, project_name, project_desc, gpg_key, submitResponse } = this.state;
        const { user } = this.props;

        var alertVariant;
        submitResponse.result === 'success' ? alertVariant = 'success' : alertVariant = 'danger';

        return (
        <div>
        {!user && <div>Please log in to view this page.</div>}
        {user &&
        <div>
          <div style={{'font-size':'35px'}}>Create New Request</div>
          <div>Create a request to onboard a new Project or to become a member of an existing project.</div><br/>
          <Form isHorizontal>
            <FormGroup label="Username" isRequired fieldId="horizontal-form-name">
              <TextInput
                isDisabled
                value={user['username']}
                isRequired
                type="text"
                id="horizontal-form-name"
                aria-describedby="horizontal-form-name-helper"
                name="horizontal-form-name"
              />
            </FormGroup>
            <FormGroup label="Email" isRequired fieldId="horizontal-form-email">
              <TextInput
                isDisabled
                value={user['email']}
                isRequired
                type="email"
                id="horizontal-form-email"
                name="horizontal-form-email"
              />
            </FormGroup>

            <Radio
              isChecked={this.state.newProject}
              name="pf-version"
              onChange={this.handleRadioButtonChange}
              label="Request New Project"
              id="radio-1"
            />
            <Radio
              isChecked={!this.state.newProject}
              name="pf-version"
              onChange={this.handleRadioButtonChange}
              label="Select Existing Project"
              id="radio-2"
            />

            {this.state.newProject  && 
            <div>
            <FormGroup label="Project Name" fieldId="horizontal-form-title" isRequired>
              <TextInput
              value={this.state.project_name}
              onChange={this.handleNameChange}
              isRequired
              id="horizontal-form-project-name"
              name="horizontal-form-project-name"
            />
            </FormGroup>
            <br/>
            <FormGroup label="Project Description" isRequired helperText="Please provide a short description for this project." fieldId="horizontal-form-exp">
            <TextArea
              value={project_desc}
              onChange={this.handleDescChange}
              isRequired
              name="horizontal-form-desc"
              id="horizontal-form-desc"
            />
            </FormGroup>
            </div>
            }

            {!this.state.newProject  && 
            <FormGroup label="Project Name" fieldId="horizontal-form-title" isRequired>
            <FormSelect
                value={project_name}
                onChange={this.onSelectChange}
                id="horzontal-form-title"
                name="horizontal-form-title"
            >
            {options.length > 0 && options.map(
              (option, index) => <FormSelectOption isDisabled={option.disabled} key={index} value={option.value} label={option.label} />
            )}
            </FormSelect>
            </FormGroup>
            }

            <FormGroup label="GPG Key" fieldId="horizontal-form-name"  helperText="Please enter your GPG Public key for secure transfer of sensitive information." >
              <TextInput
                value={gpg_key}
                type="text"
                id="horizontal-form-name"
                aria-describedby="horizontal-form-name-helper"
                name="horizontal-form-name"
                onChange={this.handleGpgChange}
              />
            </FormGroup>

            <ActionGroup>
              <Button variant="primary" style={{'padding':'5px', 'margin':'5px 5px 5px 0px'}} onClick={this.submit}>Submit Request</Button>
            </ActionGroup>
            {'message' in submitResponse &&
              <Alert variant={alertVariant} style={{'padding':'5px', 'margin':'5px 5px 5px 0px'}}>{submitResponse.message}</Alert>
            }
          </Form>
        </div>
        }
       </div>
      )
    }
}
  
export default RequestForm
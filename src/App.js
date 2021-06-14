import { Button, Grid, makeStyles, TextField } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import './App.css';
import { getLocalStorage, setLocalStorage } from './components/LocalStorage';
import TeamPlaysTable from './components/TeamPlaysTable';
import TeamsTable from './components/TeamsTable';

const useStyles = makeStyles(() => ({
	button: {
		marginLeft: '1rem',
		marginTop: '0.5rem',
	},
	childGrid: {
		padding: '0 2rem',
		overflowX: 'auto',
	},
	mainGrid: {
		height: '100vh',
	}
}));

function App() {
	const [errorMessage, setErrorMessage] = useState('');
	const [validationPassed, setValidationPassed] = useState(true);
	const [reloadTable, setReloadTable] = useState(0);

	const classes = useStyles();

	// validate 'New team' field before adding to the teams list
	const validate = useCallback((validateOnChange) => {
		const newTeamName = document.getElementById('teamName').value;
		let error = false;

		if (newTeamName === '') {
			setErrorMessage('Team name cannot be empty');
			error = true;
		}

		// get saved teams from local storage
		const teams = getLocalStorage('teams');
		
		// check if team already exists
		teams.forEach(team => {
			if (team.name === newTeamName) {
				setErrorMessage('Team already exists');
				error = true;
			}
		});

		setValidationPassed(!error);
		
		// clear error message if error is false
		if (!error) {
			setErrorMessage('');
		}

		// add new team only on button click and if there is no errors
		if (!validateOnChange && !error) {
			addNewTeam();
		}
	}, []);

	const addNewTeam = useCallback(() => {
		const teams = getLocalStorage('teams');

		// create new team
		let newTeam = {
			'name': document.getElementById('teamName').value,
			'played': 0,
			'win': 0,
			'draw': 0,
			'lost': 0,
			'points': 0,
		};

		// add new team to the existing teams array
		teams.push(newTeam);

		// save new teams in local storage
		setLocalStorage('teams', teams);
		// delete saved team from input field
		document.getElementById('teamName').value = '';
		// increase value to reload tables
		setReloadTable((oldVal) => oldVal + 1);
	}, []);

	return (
		<Grid container className={classes.mainGrid}>
			<Grid container justify="center">
				<Grid item className={classes.childGrid}>
					<TextField
						label="New team"
						id="teamName"
						error={!validationPassed}
						helperText={errorMessage}
						onChange={() => {
							validate(true)
						}}
					/>
					<Button
						variant="contained"
						color="primary"
						onClick={() => {
							validate(false);
						}}
						className={classes.button}
					>
						Add
					</Button>
					<TeamsTable
						reloadTable={reloadTable}
					/>
				</Grid>
				<Grid item className={classes.childGrid}>
					<TeamPlaysTable
						reloadTable={reloadTable}
						setReloadTable={setReloadTable}
					/>
				</Grid>
			</Grid>
		</Grid>
	);
}

export default App;

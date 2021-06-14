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
	grid: {
		padding: '0 2rem',
		overflowX: 'auto',
	},
}));

function App() {
	const [errorMessage, setErrorMessage] = useState('');
	const [validationPassed, setValidationPassed] = useState(true);
	const [reloadTable, setReloadTable] = useState(0);

	const classes = useStyles();

	const validate = useCallback((validateOnChange) => {
		const newTeamName = document.getElementById('teamName').value;
		let error = false;

		if (newTeamName === '') {
			setErrorMessage('Team name cannot be empty');
			error = true;
		}

		const teams = getLocalStorage('teams');
		
		teams.forEach(team => {
			if (team.name === newTeamName) {
				setErrorMessage('Team already exists');
				error = true;
			}
		});

		setValidationPassed(!error);
		
		if (!error) {
			setErrorMessage('');
		}

		if (!validateOnChange && !error) {
			addNewTeam();
		}
	}, []);

	const addNewTeam = useCallback(() => {
		const teams = getLocalStorage('teams');

		let newTeam = {
			'name': document.getElementById('teamName').value,
			'played': 0,
			'win': 0,
			'draw': 0,
			'lost': 0,
			'points': 0,
		};

		teams.push(newTeam);

		setLocalStorage('teams', teams);
		document.getElementById('teamName').value = '';
		setReloadTable((oldVal) => oldVal + 1);
	}, []);

	return (
		<Grid container>
			<Grid container sm={12} justify="center">
				<Grid item conatiner className={classes.grid}>
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
				<Grid item conatiner className={classes.grid}>
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

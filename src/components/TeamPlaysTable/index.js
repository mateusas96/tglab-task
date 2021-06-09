import React, { useEffect, useState, useCallback } from 'react';
import { Table, TableContainer, Paper, TableBody, TableRow, TableCell, TextField } from "@material-ui/core";
import { getLocalStorage, setLocalStorage } from '../LocalStorage';
import _ from 'lodash';

export default function TeamPlaysTable(props) {
    const [teamPlays, setTeamPlays] = useState([]);

    // add new matches
    useEffect(() => {
        const teams = getLocalStorage('teams');
        const teamSavedPlays = getLocalStorage('team_saved_plays');

        for (let i = 0; i < teams.length; i++) {
            if (i + 1 < teams.length) {
                for (let j = i + 1; j < teams.length; j++) {
                    // check if play exists
                    const playExists = Boolean(teamSavedPlays.find(tsp => {
                        return (
                            tsp.teamName1.includes(teams[i].name) && tsp.teamName2.includes(teams[j].name) ||
                            tsp.teamName1.includes(teams[j].name) && tsp.teamName2.includes(teams[i].name)
                        );
                    }));

                    // if play not exists only then add new match
                    if (!playExists) {
                        teamSavedPlays.push({
                            teamName1: teams[i].name,
                            teamScore1: '',
                            teamName2: teams[j].name,
                            teamScore2: ''
                        });
                    }
                }
            }
        }

        // update local storage
        setLocalStorage('team_saved_plays', teamSavedPlays);
        // update team plays to display data for user
        setTeamPlays(getLocalStorage('team_saved_plays'));
    }, [props.reloadTable]);

    const saveScore = useCallback((index, teamName, value) => {
        const teamSavedPlays = getLocalStorage('team_saved_plays');

        // update first team's score
        if (teamSavedPlays[index].teamName1.includes(teamName)) {
            teamSavedPlays[index].teamScore1 = value;
        }

        // update second team's score
        if (teamSavedPlays[index].teamName2.includes(teamName)) {
            teamSavedPlays[index].teamScore2 = value;
        }
        
        setLocalStorage('team_saved_plays', teamSavedPlays);
        updateTeamPoints(index, teamSavedPlays);
    }, []);

    const updateTeamPoints = useCallback((index, teamSavedPlays) => {
        const teams = getLocalStorage('teams');

        // only if both team scores exists then do something
        if (teamSavedPlays[index].teamScore1 !== '' && teamSavedPlays[index].teamScore2 !== '') {
            let teamIndex1 = findTeamIndex(teams, teamSavedPlays[index].teamName1);
            let teamIndex2 = findTeamIndex(teams, teamSavedPlays[index].teamName2);

            // team #1 won
            if (teamSavedPlays[index].teamScore1 > teamSavedPlays[index].teamScore2) {
                // team #1 update stats
                teams[teamIndex1].played += 1;
                teams[teamIndex1].win += 1;
                teams[teamIndex1].points += 3;

                // team #2 update stats
                teams[teamIndex2].played += 1;
                teams[teamIndex2].lost += 1;

            // team #2 won
            } else if (teamSavedPlays[index].teamScore1 < teamSavedPlays[index].teamScore2) {
                // team #1 update stats
                teams[teamIndex1].played += 1;
                teams[teamIndex1].lost += 1;

                // team #2 update stats
                teams[teamIndex2].played += 1;
                teams[teamIndex2].win += 1;
                teams[teamIndex2].points += 3;
            
            // draw
            } else if (teamSavedPlays[index].teamScore1 === teamSavedPlays[index].teamScore2) {
                // team #1 update stats
                teams[teamIndex1].played += 1;
                teams[teamIndex1].draw += 1;
                teams[teamIndex1].points += 1;

                // team #2 update stats
                teams[teamIndex2].played += 1;
                teams[teamIndex2].draw += 1;
                teams[teamIndex2].points += 1;
            }

            // sort teams decending
            const sortedTeams = _.sortBy(teams, 'points').reverse();
            // update local storage
            setLocalStorage('teams', sortedTeams);
        }

        // increase val to refresh tables
        props.setReloadTable((oldVal) => oldVal + 1);
    }, []);

    // find index of a team
    const findTeamIndex = useCallback((teams, teamName) => {
        return teams.findIndex((team) => {
            return team.name === teamName;
        });
    }, []);

    return (
        <TableContainer
            component={Paper}
            className="teamPlaysTableContainer"
            style={{ display: teamPlays.length === 0 ? 'none' : '' }}
        >
			<Table>
				<TableBody>
					{teamPlays.map((play, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                {play.teamName1}
                            </TableCell>
                            <TableCell align="right">
                                <TextField
                                    disabled={play.teamScore1 !== ''}
                                    type="number"
                                    InputProps={{
                                        inputProps: {
                                            min: 0,
                                        },
                                    }}
                                    defaultValue={play.teamScore1}
                                    style={{width: '50px'}}
                                    onBlur={(event) => {
                                        saveScore(index, play.teamName1, event.target.value);
                                    }}
                                >
                                </TextField>
                            </TableCell>
                            <TableCell style={{ fontWeight: 'bold' }} align="center">:</TableCell>
                            <TableCell align="left">
                                <TextField
                                    disabled={play.teamScore2 !== ''}
                                    type="number"
                                    InputProps={{
                                        inputProps: {
                                            min: 0,
                                        },
                                    }}
                                    defaultValue={play.teamScore2}
                                    style={{width: '50px'}}
                                    onBlur={(event) => {
                                        saveScore(index, play.teamName2, event.target.value);
                                    }}
                                >
                                </TextField>
                            </TableCell>
                            <TableCell>
                                {play.teamName2}
                            </TableCell>
                        </TableRow>
                    ))}
				</TableBody>
			</Table>
		</TableContainer>
    );
}
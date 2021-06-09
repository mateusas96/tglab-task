import React, { useEffect, useState } from 'react';
import { Table, TableContainer, Paper, TableBody, TableRow, TableCell, TextField } from "@material-ui/core";
import { getLocalStorage } from '../LocalStorage';

export default function TeamPlaysTable(props) {
    const [teamPlays, setTeamPlays] = useState([]);

    useEffect(() => {
        const teams = getLocalStorage('teams');
        const teamPlays = [];

        for (let i = 0; i < teams.length; i++) {
            if (i + 1 < teams.length) {
                for (let j = i + 1; j < teams.length; j++) {
                    teamPlays.push({
                        teamName1: teams[i].name,
                        teamScore1: '',
                        teamName2: teams[j].name,
                        teamScore2: ''
                    });
                }
            }
        }

        setTeamPlays(teamPlays);
    }, [props.reloadTable]);

    return (
        <TableContainer component={Paper} className="teamPlaysTableContainer">
			<Table>
				<TableBody>
					{teamPlays.map((play, index) => (
                        <TableRow key={index}>
                            <TableCell>
                                {play.teamName1}
                            </TableCell>
                            <TableCell>
                                <TextField
                                    type="number"
                                    InputProps={{
                                        inputProps: {
                                            min: 0,
                                        },
                                    }}
                                    style={{width: '50px'}}
                                >
                                </TextField>
                            </TableCell>
                            <TableCell>:</TableCell>
                            <TableCell>
                                <TextField
                                    disabled={play.teamScore2 !== ''}
                                    type="number"
                                    InputProps={{
                                        inputProps: {
                                            min: 0,
                                        },
                                    }}
                                    style={{width: '50px'}}
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
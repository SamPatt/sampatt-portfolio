import React from 'react';
import Skill from './Skill';
import * as Icons from '../assets';

function Skills() {
    return (
        <div className="skills">
            <h2>Technologies I've Used</h2>
            <div className="skillsGrid">
                <Skill source={Icons.HTML} alt="The logo icon for HTML" title="HTML"/>
                <Skill source={Icons.CSS} alt="The logo icon for CSS" title="CSS"/>
                <Skill source={Icons.JavaScript} alt="The logo icon for JavaScript" title="JavaScript"/>
                <Skill source={Icons.MongoDB} alt="The logo icon for MongoDB" title="MongoDB"/>
                <Skill source={Icons.ExpressJSDark} alt="The logo icon for ExpressJS" title="ExpressJS"/>
                <Skill source={Icons.ReactDark} alt="The logo icon for React" title="React"/>
                <Skill source={Icons.NodeJSDark} alt="The logo icon for NodeJS" title="NodeJS"/>
                <Skill source={Icons.ViteDark} alt="The logo icon for Vite" title="Vite"/>
                <Skill source={Icons.PythonDark} alt="The logo icon for Python" title="Python"/>
                <Skill source={Icons.FlaskDark} alt="The logo icon for Flask" title="Flask"/>
                <Skill source={Icons.Django} alt="The logo icon for Django" title="Django"/>
                <Skill source={Icons.PostgreSQLDark} alt="The logo icon for PostgreSQL" title="PostgreSQL"/>
                <Skill source={Icons.Git} alt="The logo icon for Git" title="Git"/>
                <Skill source={Icons.GithubDark} alt="The logo icon for GitHub" title="GitHub"/>
                <Skill source={Icons.Heroku} alt="The logo icon for Heroku" title="Heroku"/>
                <Skill source={Icons.LinuxDark} alt="The logo icon for Linux" title="Linux"/>
                <Skill source={Icons.MarkdownDark} alt="The logo icon for Markdown" title="Markdown"/>
                <Skill source={Icons.MySQLDark} alt="The logo icon for MySQL" title="MySQL"/>
                <Skill source={Icons.NetlifyDark} alt="The logo icon for Netlify" title="Netlify"/>
                <Skill source={Icons.Postman} alt="The logo icon for Postman" title="Postman"/>
            </div>            
        </div>
    );
}

export default Skills;

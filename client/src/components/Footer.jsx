import React from 'react';
import  {CardFooter, Container, Image} from 'react-bootstrap';


const Footer = () => {
    const yeart = new Date().getFullYear();

    return (
        <CardFooter className='bg-light text-center text-muted'>
            <Container>
                <p>Copyright &copy; {yeart}</p>
               
            </Container>
        </CardFooter>
    )
}

export default Footer
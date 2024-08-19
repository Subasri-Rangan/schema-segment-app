 

import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Container } from 'react-bootstrap';
import './App.css';

const App = () => {
  const [showModal, setShowModal] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [availableSchemas, setAvailableSchemas] = useState([
    { label: "First Name", value: "first_name" },
    { label: "Last Name", value: "last_name" },
    { label: "Gender", value: "gender" },
    { label: "Age", value: "age" },
    { label: "Account Name", value: "account_name" },
    { label: "City", value: "city" },
    { label: "State", value: "state" }
  ]);

  const [dropdowns, setDropdowns] = useState([null]); // First dropdown is for initial selection

  const handleAddDropdown = () => {
    setDropdowns([...dropdowns, null]);
  };

  const handleSchemaChange = (index, event) => {
    const updatedSchemas = [...selectedSchemas];
    const selectedValue = event.target.value;

    // Prevent selecting the same schema twice
    updatedSchemas[index] = availableSchemas.find(schema => schema.value === selectedValue);

    setSelectedSchemas(updatedSchemas);

    // Filter out selected options from the available schemas
    const remainingSchemas = availableSchemas.filter(
      schema => !updatedSchemas.includes(schema)
    );

    setAvailableSchemas(remainingSchemas);
  };

  const handleSaveSegment = () => {
    const data = {
      segment_name: segmentName,
      schema: selectedSchemas.map(schema => ({ [schema.value]: schema.label }))
    };
    console.log("Segment Data:", data);
    // send `data` to server using fetch/axios
    fetch('/api/save-segment', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    setShowModal(false); // close modal after saving
  };

  return (
    <Container>
      <Button className= "button" variant="primary" onClick={() => setShowModal(true)}>
        Save Segment
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title> Save Segment</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form.Group controlId="segmentName">
            <Form.Label>Enter the Name of the Segment </Form.Label>
            <Form.Control
              type="text"
              value={segmentName}
              onChange={(e) => setSegmentName(e.target.value)}
              placeholder="Name of the Segment"
            />
          </Form.Group>
          <div className='subtitle'>To save your segment, you need to add the schemas to build he query</div>
          <div className="mt-3 p-3" style={{ backgroundColor: '#e7f3ff', borderRadius: '5px' }}>
            {dropdowns.map((_, index) => (
              <Form.Group key={index} controlId={`schemaSelect${index}`}>
                <Form.Control
                  as="select"
                  onChange={(e) => handleSchemaChange(index, e)}
                >
                  <option value="">Add schema to segment</option>
                  {availableSchemas.map((schema, i) => (
                    <option key={i} value={schema.value}>{schema.label}</option>
                  ))}
                </Form.Control>
              </Form.Group>
            ))}
          </div>

          <Button variant="link" onClick={handleAddDropdown}>+ Add new schema</Button>
        </Modal.Body>
        <Modal.Footer>
        <Button variant="primary" onClick={handleSaveSegment}>
            Save Segment
          </Button>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default App;

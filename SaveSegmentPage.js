import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { Modal, Button, Form, Container } from 'react-bootstrap';
import './SaveSegmentPage.css';

const SaveSegmentPage = () => {
  const [showModal, setShowModal] = useState(false);
  const [segmentName, setSegmentName] = useState('');
  const [selectedSchemas, setSelectedSchemas] = useState([]);
  const [availableSchemas] = useState([
    { label: "First Name", value: "first_name" },
    { label: "Last Name", value: "last_name" },
    { label: "Gender", value: "gender" },
    { label: "Age", value: "age" },
    { label: "Account Name", value: "account_name" },
    { label: "City", value: "city" },
    { label: "State", value: "state" }
  ]);

  const [dropdowns, setDropdowns] = useState([null]);

  const handleAddDropdown = () => {
    setDropdowns([...dropdowns, null]);
  };

  const handleSchemaChange = (index, event) => {
    const selectedValue = event.target.value;
    const updatedSchemas = [...selectedSchemas];

    const selectedSchema = availableSchemas.find(schema => schema.value === selectedValue);
    updatedSchemas[index] = selectedSchema;

    setSelectedSchemas(updatedSchemas);
  };

  const getFilteredSchemas = (index) => {
    return availableSchemas.filter(
      schema => !selectedSchemas.includes(schema) || selectedSchemas[index]?.value === schema.value
    );
  };

  const handleSaveSegment = async () => {
    const data = {
      segment_name: segmentName,
      schema: selectedSchemas.map(schema => ({ [schema.value]: schema.label }))
    };

    console.log("Segment Data:", data);

    try {
      const response = await fetch('https://webhook.site/a2982a41-29e4-472a-af22-3cfc939709b2', {
        mode: 'no-cors',
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });

      if (response.ok) {
        console.log("Data successfully sent to the server:", data);
      } else {
        console.error("Failed to send data to the server:", response.statusText);
      }
    } catch (error) {
      console.error("An error occurred while sending data to the server:", error);
    }

    setShowModal(false);
  };

  return (
    <Container>
      <Button variant="primary" onClick={() => setShowModal(true)}>
        Save Segment
      </Button>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Save Segment</Modal.Title>
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
          <div className='subtitle'>To save your segment, you need to add the schemas to build the query</div>
          <div className="mt-3 p-3" style={{ backgroundColor: '#e7f3ff', borderRadius: '5px' }}>
            {dropdowns.map((_, index) => (
              <Form.Group key={index} controlId={`schemaSelect${index}`}>
              {/* <Form.Label>Add schema to segment</Form.Label> */}
                <Form.Control
                  as="select"
                  onChange={(e) => handleSchemaChange(index, e)}
                  value={selectedSchemas[index]?.value || ""}
                >
                  <option value="">Add schema to segment</option>
                  {getFilteredSchemas(index).map((schema, i) => (
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

export default SaveSegmentPage;

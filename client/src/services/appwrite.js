import { Client, Databases, ID } from 'appwrite';

const client = new Client()
    .setEndpoint('https://nyc.cloud.appwrite.io/v1')
    .setProject('6a6f2efa002b5015679b'); // Your Appwrite Project ID

export const databases = new Databases(client);

// Function to save booking form submission directly to Appwrite DB
export const saveBookingToAppwrite = async (formData) => {
    try {
        const response = await databases.createDocument(
            'tricity_db',
            'bookings',
            ID.unique(),
            {
                institutionName: formData.institutionName,
                contactPerson: formData.contactPerson,
                phone: formData.phone,
                email: formData.email,
                city: formData.city,
                status: 'Pending'
            }
        );
        return response;
    } catch (error) {
        console.error('Appwrite Database error:', error);
        throw error;
    }
};

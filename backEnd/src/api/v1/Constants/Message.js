const message = {
    post: {
        succ: "Data added successfully",
        fail: "Failed to add data",
        empty: "No data found",
        sameEntry: "Same entry not allowed",
        custom: (msg) => msg,
    },
    get: {
        succ: "Data fetched successfully",
        fail: "Failed to fetch data",
        empty: "No data found",
        enough: "Not Enough Data to Fetch",
        custom: (msg) => msg,
    },
    put: {
        succ: "Data updated successfully",
        fail: "Failed to update data",
        custom: (msg) => msg,
    },
    patch: {
        succ: "Data patched successfully",
        fail: "Failed to patch data",
        custom: (msg) => msg,
    },
    delete: {
        succ: "Data deleted successfully",
        fail: "Failed to delete data",
        custom: (msg) => msg,
    },
    error: "Error",
    none: "No such data found",
    custom: (msg) => msg,
};

const MESSAGE = message;

export default MESSAGE;
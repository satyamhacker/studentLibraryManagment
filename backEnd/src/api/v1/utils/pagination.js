export const getPaginationParams = (req) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const offset = (page - 1) * limit;
  
  return { page, limit, offset };
};

export const createPaginationResponse = (data, totalCount, page, limit) => {
  const totalPages = Math.ceil(totalCount / limit);
  
  return {
    data,
    pagination: {
      currentPage: page,
      totalPages,
      totalItems: totalCount,
      itemsPerPage: limit,
      hasNextPage: page < totalPages,
      hasPrevPage: page > 1
    }
  };
};
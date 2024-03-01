import { Button } from "react-bootstrap";
import useGetLottoOperator from "../../react-query/api-hooks/useGetLottoOperator";
// import { useSelector } from "react-redux";
// import { useForm } from "react-hook-form";
// import { yupResolver } from "@hookform/resolvers/yup";
// import { toast } from "react-toastify";
// import * as yup from "yup";
// import { useState } from "react";
// import HTTP from "../../utils/httpClient";
// import { useQueryClient } from "@tanstack/react-query";

// const schema = yup.object().shape({
//   name: yup.string().required("This is a required field"),
//   del: yup.string().required("This is a required field"),
//   play: yup.string().required("This is a required field"),
//   logo: yup.mixed().required("This is a required field"),
// });

const UploadAffilates = () => {
  const { userLottoOperator, isLoadingLottoOperator } = useGetLottoOperator([]);

  return (
    <div>
      <div>
        <div>
          <div className="container">
            <span>
              <strong className="text-dark">Upload Affilates</strong>
            </span>
            <br />

            <form
              className="mt-4"
              encType="multipart/form-data"
              //   onSubmit={handleSubmit(submitForm)}
            >
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control mb-2 p-3"
                  placeholder="Name"
                />
              </div>
              <div className="mb-3">
                <select
                  className="form-select mb-2 p-3"
                  //   {...register("operator", {
                  //     required: "Required",
                  //   })}
                >
                  <option value="">Select Operator</option>
                  {isLoadingLottoOperator ? (
                    <option value="" disabled>
                      Loading...
                    </option>
                  ) : (
                    userLottoOperator?.data?.map((operator: any) => (
                      <option key={operator.id} value={operator.id}>
                        {operator?.name}
                      </option>
                    ))
                  )}
                </select>
              </div>
              <div className="mb-3">
                <input
                  type="text"
                  className="form-control mb-2 p-3"
                  placeholder="Link"
                />
              </div>
              <div className="mb-3">
                <label>Banner</label>
                <input
                  type="file"
                  className="form-control mb-2 p-3"
                  //   {...register("logo", {
                  //     required: "Required",
                  //   })}
                  name="logo"
                />
                {/* {errors.logo && (
                  <p className="text-danger text-capitalize">
                    {errors.logo.message}
                  </p>
                )} */}
              </div>

              <Button
                type="submit"
                className="w-100 p-3"
                style={{ background: "#27AAE1" }}
              >
                Upload
              </Button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UploadAffilates;

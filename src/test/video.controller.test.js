import { afterEach, beforeEach, describe } from "mocha";
import { expect } from "chai";
import sinon from "sinon"; // thư viện mock - giả lập
import sequelize from "../models/connect.js";
import initModels from "../models/init-models.js";
import { getListVideos } from "../controllers/video.controller.js";

const model = initModels(sequelize);

describe("getVideos", () => {
  let req, res, findAllStub;
  beforeEach(() => {
    // giả lập request và response object và findAll function
    req = {};
    res = {
      status: sinon.stub().returnsThis(),
      json: sinon.stub(),
    };
    findAllStub = sinon.stub(model.video, "findAll");
  });

  afterEach(() => {
    // hủy giả lập sau khi test
    findAllStub.restore();
  });

  it("should return list videos", async () => {
    const videos = [
      {
        video_id: 1,
        video_name: "Introduction to Coding",
        thumbnail: "deadpool.jpg",
        description: "Learn the basics of coding",
        views: 1500,
        source: "youtube.com",
        user_id: 1,
        type_id: 2,
      },
    ];
    // trả về danh sách video
    findAllStub.resolves(videos);

    await getListVideos(req, res);

    expect(res.status.calledWith(200)).to.be.true;
  });
});

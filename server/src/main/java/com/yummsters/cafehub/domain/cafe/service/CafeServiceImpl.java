package com.yummsters.cafehub.domain.cafe.service;

import java.io.BufferedReader;
import java.io.File;
import java.io.IOException;
import java.io.InputStreamReader;
import java.net.HttpURLConnection;
import java.net.URL;
import java.net.URLEncoder;
import java.util.ArrayList;
import java.util.List;

import com.yummsters.cafehub.domain.tag.entity.StoreTag;
import com.yummsters.cafehub.domain.tag.repository.StoreTagRepository;
import org.json.simple.JSONArray;
import org.json.simple.JSONObject;
import org.json.simple.parser.JSONParser;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import com.yummsters.cafehub.domain.cafe.dto.CafeDto;
import com.yummsters.cafehub.domain.cafe.dto.ModifyCafeDto;
import com.yummsters.cafehub.domain.cafe.entity.Cafe;
import com.yummsters.cafehub.domain.cafe.repository.CafeRepository;
import com.yummsters.cafehub.domain.member.entity.Member;
import com.yummsters.cafehub.domain.member.repository.MemberRepository;
import com.yummsters.cafehub.domain.review.entity.FileVo;
import com.yummsters.cafehub.domain.review.repository.FileVoRepository;
import com.yummsters.cafehub.domain.userMyPage.entity.WishCafe;
import com.yummsters.cafehub.domain.userMyPage.repository.WishCafeRepository;

import lombok.RequiredArgsConstructor;
import lombok.extern.log4j.Log4j2;

@Service
@RequiredArgsConstructor
@Log4j2
public class CafeServiceImpl implements CafeService {
    private final CafeRepository cafeRepository;
    private final WishCafeRepository wishRepository;
    private final MemberRepository memberRepository;
    private final FileVoRepository fileVoRepository;
    private final StoreTagRepository storeTagRepository;

    @Value("${kakaomap-key}")
    private String apiKey;

    @Override
    public void saveCafe() throws Exception {
        List<Cafe> cafes = new ArrayList<>();

        List<String> regions = new ArrayList<>();
        regions.add("서울"); regions.add("부산"); regions.add("대구");regions.add("인천");
        regions.add("광주"); regions.add("대전"); regions.add("울산"); regions.add("세종");
        regions.add("경기"); regions.add("강원"); regions.add("충북"); regions.add("충남");
        regions.add("전북"); regions.add("전남"); regions.add("경북"); regions.add("경남"); regions.add("제주");

        int totalCount = 45; // 총 데이터 수
        int countPerPage = 15; // 페이지 당 데이터 수
        int totalPages = (totalCount + countPerPage - 1) / countPerPage; // 전체 페이지 수

        for (String region : regions) {

            for (int page = 1; page <= totalPages; page++) { // API 에서 최대로 제공하는 데이터 수
                StringBuilder urlBuilder = new StringBuilder("https://dapi.kakao.com/v2/local/search/keyword.json");
                urlBuilder.append("?query=" + URLEncoder.encode(region + "테마카페", "UTF-8"));
                urlBuilder.append("&page=" + page);

                URL url = new URL(urlBuilder.toString());
                HttpURLConnection conn = (HttpURLConnection) url.openConnection();
                conn.setRequestMethod("GET");
                conn.setRequestProperty("content-type", "application/json;charset=UTF-8");
                conn.setRequestProperty("Authorization", " KakaoAK "+ apiKey);

                StringBuilder resBuilder = new StringBuilder();
                try (BufferedReader br = new BufferedReader(new InputStreamReader(conn.getInputStream()))) {
                    String line;
                    while ((line = br.readLine()) != null) {
                        resBuilder.append(line);
                    }
                } finally {
                    conn.disconnect();
                }

                JSONParser parser = new JSONParser();
                JSONObject mobj = (JSONObject) parser.parse(resBuilder.toString());
                JSONArray data = (JSONArray) mobj.get("documents");

                for (int i = 0; i < data.size(); i++) {
                    JSONObject cafeJson = (JSONObject) data.get(i);

                    Cafe cafe = new Cafe();
                    cafe.setCafeName((String) cafeJson.get("place_name"));
                    cafe.setTel((String) cafeJson.get("phone"));
                    cafe.setAddress((String) cafeJson.get("address_name"));
                    cafe.setLat((String) cafeJson.get("y"));
                    cafe.setLng((String) cafeJson.get("x"));

                    cafes.add(cafe);
                }
            }
        }
        cafeRepository.saveAll(cafes);
    }


    @Override
    public List<CafeDto> getCafes() throws Exception {
        List<Cafe> cafeList = cafeRepository.findAll(); // Entity, DB의 모든 정보
        List<CafeDto> cafeDTOList = new ArrayList<>(); // DTO
        for (Cafe cafe : cafeList) {
            CafeDto cafeDTO = cafe.toDTO(); // Entity -> DTO로 변환
            cafeDTOList.add(cafeDTO); // 내용 복사
        }
        return cafeDTOList;
    }

    @Override
    public boolean isWishCafe(Integer memNo, Integer cafeNo) throws Exception {
        return wishRepository.existsByMember_memNoAndCafe_cafeNo(memNo, cafeNo);
    }

    @Override
    @Transactional
    public boolean toggleWishCafe(Integer memNo, Integer cafeNo) throws Exception {
        Cafe cafe = cafeRepository.findByCafeNo(cafeNo);
        Member member = memberRepository.findByMemNo(memNo);
        boolean isWish = wishRepository.existsByMember_memNoAndCafe_cafeNo(memNo, cafeNo);
        if(isWish) {
            wishRepository.deleteByMember_memNoAndCafe_cafeNo(memNo, cafeNo);
            return false;
        } else {
            wishRepository.save(WishCafe.builder().member(member).cafe(cafe).build());
            return true;
        }
    }

    // cafe 조회
    @Override
    public Cafe searchCafe(Integer cafeNo) throws Exception {
        Cafe responseCafe = cafeRepository.findByCafeNo(cafeNo);
        if (responseCafe == null) throw new Exception("존재하지 않는 카페입니다");
        return responseCafe;
    }

    @Override
    public CafeDto getCafeByCafeNo(Integer cafeNo) throws Exception {
        return cafeRepository.findByCafeNo(cafeNo).toDTO();
    }

    // 혜리 part---------------------------------------------------------------------------

	@Override
	public Page<CafeDto> getUnpaidCafes(Pageable pageable) throws Exception {
		Page<Cafe> unpaidCafesPage = cafeRepository.findByIsPaidFalseOrderByPaidDate(pageable);
		Page<CafeDto> unpaidCafesDtoPage = unpaidCafesPage.map(Cafe::toDTO);
		return unpaidCafesDtoPage;
	}
	// 수빈 part---------------------------------------------------------------------------
	
	
	@Override
	  public Cafe getCafeInfo(Integer cafeNo) throws Exception{
		
	        return cafeRepository.findByCafeNo(cafeNo);
	    }

	@Override
	public Integer modifyCafe(Integer cafeNo, ModifyCafeDto modifyCafeDto, List<MultipartFile> files)throws Exception {
	    // 기존 카페 정보 가져오기
	    Cafe cafe = cafeRepository.findByCafeNo(cafeNo);
        System.out.println("mod" + modifyCafeDto.getTagName());

	    // 카페 정보 업데이트
	    if (modifyCafeDto.getThumbImg() != null) {
	        cafe.setThumbImg(modifyCafeDto.getThumbImg());
	    }
	    if (modifyCafeDto.getAddress() != null) {
	        cafe.setAddress(modifyCafeDto.getAddress());
	    }
	    if (modifyCafeDto.getCafeName() != null) {
	        cafe.setCafeName(modifyCafeDto.getCafeName());
	    }
	    if (modifyCafeDto.getTel() != null) {
	        cafe.setTel(modifyCafeDto.getTel());
	    }
	    if (modifyCafeDto.getTagName() != null) {
            StoreTag storeTagMod = storeTagRepository.findByStoreTagNo(Integer.parseInt(modifyCafeDto.getTagName())+1);
	        cafe.setStoreTag(storeTagMod);
	    }
	    if (modifyCafeDto.getOperTime() != null) {
	        cafe.setOperTime(modifyCafeDto.getOperTime());
	    }

	    if (files != null && !files.isEmpty()) {
	        String dir = "c:/soobin/upload/";
            //String dir = "/Users/gmlwls/Desktop/kosta/upload/"; // 다른 업로드 경로

            String fileNums = "";

	        for (MultipartFile file : files) {
	            if (!file.isEmpty()) {
	                try {
	                    FileVo fileVo = FileVo.builder()
	                            .directory(dir)
	                            .name(file.getOriginalFilename())
	                            .size(file.getSize())
	                            .contenttype(file.getContentType())
	                            .data(file.getBytes())
	                            .build();

	                    // 파일 업로드
	                    fileVoRepository.save(fileVo);

	                    File uploadFile = new File(dir + fileVo.getFileNum());
	                    file.transferTo(uploadFile);

	                    fileNums += (fileNums.isEmpty() ? "" : ",") + fileVo.getFileNum();
	                } catch (IOException e) {
	                    e.printStackTrace();
	                    // 파일 업로드 중 예외 처리
	                }
	            }
	        }
	        // 파일 번호 목록을 썸네일 이미지로 사용
	        cafe.setThumbImg(fileNums);
	    }
	    // 카페 정보 저장
	    cafeRepository.save(cafe);

	    return cafe.getCafeNo();
	}

 
}

